const Review = require('../models/review.model');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.getReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const reviewData = { ...req.body, user: req.user.id };
  const review = await Review.create(reviewData);

  res.status(201).json({
    status: 'success',
    data: { review },
  });
});
