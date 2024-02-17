const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');


const router = express.Router({ mergeParams: true });
// POST /tour/981f78/reviews
// GET /tour/981f78/reviews
// POST /reviews

// router.route('/').get(reviewController.getAllReviews).post(authController.protect, authController.restrictTo('user'), reviewController.createReview);

router.use(authController.protect);
// router.route('/').get(reviewController.getAllReviews).post(authController.protect, authController.restrictTo('user'), reviewController.setTourUserIds, reviewController.createReview);

// router.route('/:id').get(reviewController.getReview).patch(reviewController.updateReview).delete(reviewController.deleteReview);

router.route('/').get(reviewController.getAllReviews).post(authController.restrictTo('user'), reviewController.setTourUserIds, reviewController.createReview);

router.route('/:id').get(reviewController.getReview).patch(authController.restrictTo('user', 'admin'), reviewController.updateReview).delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview);

module.exports = router;