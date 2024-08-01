const router = require('express').Router();
const reviewController = require('../controllers/reviewController');

router
  .route('/')
  .post(reviewController.createNewReview)
  .get(reviewController.getAllReviews);

router
  .route('/:id')
  .get(reviewController.getReview)
  .put(reviewController.updateReview)
  .delete(reviewController.deleteReview);

router.route('/product/:id').get(reviewController.getReviewsByProductId);

module.exports = router;
