const express = require('express');
const {
  getReviews,
  createReview,
} = require('../controllers/review.controller');
const { protect, restrictTo } = require('../controllers/auth.controller');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getReviews)
  .post(protect, restrictTo('user'), createReview);

module.exports = router;
