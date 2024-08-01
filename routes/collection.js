const router = require('express').Router();
const collectionController = require('../controllers/collectionController');

router
  .route('/')
  .post(collectionController.createCollection)
  .get(collectionController.getAllCollections);

router
  .route('/:id')
  .get(collectionController.getCollection)
  .put(collectionController.updateCollection)
  .delete(collectionController.deleteCollection);

module.exports = router;
