const express = require('express');
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTopFiveCheapTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tour.controller');
const { protect, restrictTo } = require('../controllers/auth.controller');
const reviewRouter = require('./review.routes');

const router = express.Router();

// validate the id param
// router.param('id', checkId);

// Alias routes
router.route('/top-5-cheap').get(getTopFiveCheapTours, getAllTours);

router.route('/tour-stats').get(getTourStats);

router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(protect, getAllTours).post(createTour);

/*Nested routes
POST /tour/12345/reviews
GET /tour/12345/reviews
GET /tour/12345/reviews/57575
*/
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/:id')
  .get(protect, getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
