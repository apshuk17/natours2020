const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// express routes
const tourRouter = require('./routes/tour.routes');
const userRouter = require('./routes/user.routes');
const viewRouter = require('./routes/view.routes');

// Error handling class
const AppError = require('./utils/appError');

// Global Error handling middleware
const globalErrorHandler = require('./controllers/error.controller');

// Express application
const app = express();

// Set security http headers
app.use(helmet());

// Limit the API rate
const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try after an hour',
});

app.use('/api', limiter);

// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Parse the body JSON in request
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NOSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Set View Engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Page Routes
app.use('/', viewRouter);

// API Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Unhandled route Error handling
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} in this server`, 404));
});

// Error handling global middleware
app.use(globalErrorHandler);

module.exports = app;
