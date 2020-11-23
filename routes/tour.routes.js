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

const router = express.Router();

// validate the id param
// router.param('id', checkId);

// Alias routes
router.route('/top-5-cheap').get(getTopFiveCheapTours, getAllTours);

router.route('/tour-stats').get(getTourStats);

router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
