const express = require('express');
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
// const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// router.param('id', tourController.checkID);

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

// tours-within?distance=233&center=-40,45&unit=mi
// tours-within/233/center/-40,45/unit/mi

router.route('/').get(tourController.getAllTours).post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createTour);

// router.route('/').get(authController.protect, tourController.getAllTours).post(tourController.createTour);
// router.route('/').get(tourController.getAllTours).post(tourController.createTour);
// router.route('/').get(tourController.getAllTours).post(tourController.checkBody, tourController.createTour);

router.route('/:id').get(tourController.getTour).patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.uploadTourImages, tourController.resizeTourImages, tourController.updateTour).delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

// router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

// POST /tour/981f78/reviews
// GET /tour/981f78/reviews
// GET /tour/981f78/reviews/881f1ve

// router.route('/:tourId/reviews').post(authController.protect, authController.restrictTo('user'), reviewController.createReview);

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;