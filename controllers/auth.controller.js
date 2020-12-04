const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const createJWT = async (id) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;
  return await jwt.sign({ id }, secret, {
    expiresIn,
  });
};

const verifyJWT = async (token) => {
  const secret = process.env.JWT_SECRET;
  return await promisify(jwt.verify)(token, secret);
};

const createAndSendToken = async (user, statusCode, res) => {
  // Create JWT token
  const token = await createJWT(user._id);

  // Set the cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('natoursjwt', token, cookieOptions);

  const data = {
    user: { name: user.name, email: user.email, role: user.role },
  };

  res.status(statusCode).json({
    status: 'success',
    token,
    data,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const userData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    photo: req.body.photo,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  };
  const newUser = await User.create(userData);

  // Create and send JWT token
  await createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    const error = new AppError('Please provide email and password', 400);
    return next(error);
  }

  // 2) Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything is OK, create and send token to the client
  await createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get the token and check if it's there
  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please login to get access', 401)
    );
  }

  // 2) Verify the token
  const decoded = await verifyJWT(token);

  // 3) Check if user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user associated with this token no longer exist', 401)
    );
  }

  // 4) If user changed password, after JWT was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User has recently changed the password. Please login again.',
        401
      )
    );
  }

  // Grant access to the protected route
  req.user = {
    id: currentUser._id,
    email: currentUser.email,
    role: currentUser.role,
  };
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have the permission to perform this action',
          403
        )
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get the user based on POST request
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address', 404));
  }

  // 2) Get the password reset token
  const resetToken = user.createPasswordResetToken();

  // save the user to add password reset token and expiry date in the database
  await user.save({ validateBeforeSave: false });

  // 3) Send the email to user account
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetpassword/${resetToken}`;

  const message = `Forgot your password? Please click this link ${resetUrl}.\nIf you didn't forget
  your password, please ignore this email.`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Your password reset token(valid for 10 min).',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Please try later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is a user, set the password.
  if (!user) {
    return next(new AppError('Token has expired or invalid', 400));
  }
  // Set the password and password confirm
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  // Delete the passwordResetToken and passwordResetExpires
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // 3) Update the passwordChangedAt property in the document and save
  // Password changed is managed at the model layer
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password is reset successfully',
  });
});

// This handler is for logged in users
exports.updateMyPassword = catchAsync(async (req, res, next) => {
  // 1) Get user from database
  const loggedInUserId = req.user.id;

  const user = await User.findById(loggedInUserId).select('+password');

  // 2) Check if posted password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password does not match.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  // 4) Log user in, send JWT, create and send token to the client
  await createAndSendToken(user, 200, res);
});
