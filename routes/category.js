const router = require('express').Router();
const categoryController = require('../controllers/categoryController');

router
  .route('/')
  .post(categoryController.createCategory)
  .get(categoryController.getAllCategories);

router
  .route('/:id')
  .get(categoryController.getCategory)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
