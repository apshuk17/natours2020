const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

exports.signup = catchAsync(async (req, res, next) => {
  const userData = {
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  };
  const newUser = await User.create(userData);

  // Create JWT token
  const token = await createJWT(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: { name: newUser.name, email: newUser.email },
    },
  });
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

  // 3) If everything is OK, send token to the client
  const token = await createJWT(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
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
  req.user = currentUser;
  next();
});
