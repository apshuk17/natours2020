const path = require('path');
const express = require('express');
const morgan = require('morgan');

// express routes
const tourRouter = require('./routes/tour.routes');
const userRouter = require('./routes/user.routes');

// Express application
const app = express();

// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
