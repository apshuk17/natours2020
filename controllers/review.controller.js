// const redis = require('redis');
// const { promisify } = require('util');

const Review = require('../models/review.model');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

// const redisUrl = 'redis://127.0.0.1:6379';

// exports.getReviews = catchAsync(async (req, res, next) => {
//   const redisClient = redis.createClient(redisUrl);
//   const getFromRedis = promisify(redisClient.get).bind(redisClient);
//   const currentUserId = req.user.id;

//   // Do we have any cached data, related to this query
//   const cachedReviews = await getFromRedis(currentUserId.toString());

//   // If yes, then respond to the request right away
//   if (cachedReviews) {
//     const parsedReviews = JSON.parse(cachedReviews);
//     console.log('Serving from CACHE');
//     return res.status(200).json({
//       status: 'success',
//       results: parsedReviews.length,
//       data: {
//         reviews: parsedReviews,
//       },
//     });
//   }

//   /* If no, we need to respond to request and update our cache
//   to store the data */
//   const reviews = await Review.find({ user: currentUserId });
//   console.log('Serving from DB');
//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });

//   redisClient.set(currentUserId.toString(), JSON.stringify(reviews));
// });

exports.getReviews = catchAsync(async (req, res, next) => {
  const currentUserId = req.user.id;
  const { tourId } = req.params;

  const filter = { user: currentUserId };
  if (tourId) filter.tour = tourId;

  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { review },
  });
});
