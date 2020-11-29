const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works with CREATE and SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
});

// Document middleware
userSchema.pre('save', async function (next) {
  // Only run this function if password is actually changed
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Not add passwordConfirm field to the database
  this.passwordConfirm = undefined;
  next();
});

// Document Instance method
userSchema.methods.correctPassword = async function (
  clientPassword,
  dbPassword
) {
  return await bcrypt.compare(clientPassword, dbPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTIssuedAtTimestamp) {
  if (this.passwordChangedAt) {
    // Convert date to seconds, because JWTTimestamp is in seconds
    const passwordChangedAtInTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTIssuedAtTimestamp < passwordChangedAtInTimestamp;
  }

  /* False means either password never changed or the time
  when password last changed is less than the JWTIssuedAtTimestamp, i.e.,
  password was changed before the token was issued.
  */
  return false;
};

// Model
const User = mongoose.model('User', userSchema);

module.exports = User;
