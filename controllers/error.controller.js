const AppError = require('../utils/appError');

const handleCastErrorDB = (error) => {
  return new AppError(`Invalid ${error.path}: ${error.value}`, 400);
};

const handleDuplicateFieldsErrorDB = (error) => {
  const message = `Duplicate field value ${error.keyValue.name}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () => {
  return new AppError(`Invalid token. Please log in again`, 400);
};

const handleTokenExpiredError = () => {
  return new AppError(`Your token has expired. Please log in again`, 400);
};

const sendErrorDev = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (res, err) => {
  // Operational error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error
  } else {
    console.error('ERROR', err);

    res.status(500).json({
      status: 'error',
      message: 'something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(res, err);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    // When signature don't match
    if (error.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
    // When token expired
    if (error.name === 'TokenExpiredError') error = handleTokenExpiredError();
    sendErrorProd(res, error);
  }
};
