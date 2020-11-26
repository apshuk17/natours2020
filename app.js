const path = require('path');
const express = require('express');
const morgan = require('morgan');

// express routes
const tourRouter = require('./routes/tour.routes');
const userRouter = require('./routes/user.routes');

// Error handling class
const AppError = require('./utils/appError');

// Global Error handling middleware
const globalErrorHandler = require('./controllers/error.controller');

// Express application
const app = express();

// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Unhandled route Error handling
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} in this server`, 404));
});

// Error handling global middleware
app.use(globalErrorHandler);

module.exports = app;
