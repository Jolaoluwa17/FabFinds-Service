const router = require('express').Router();
const productImgController = require('../controllers/productImgController');

router
  .route('/:id')
  .get(productImgController.getImageById)
  .delete(productImgController.deleteImageById);

module.exports = router;
