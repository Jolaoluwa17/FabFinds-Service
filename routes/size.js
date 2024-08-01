const express = require('express');
const router = express.Router();
const sizeController = require('../controllers/sizeController');
const verifyJWT = require('../middlewares/verifyJWT');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middlewares/verifyRoles');

router
  .route('/')
  .post(sizeController.createSize)
  .get(sizeController.getAllSizes);

router
  .route('/:id')
  .get(sizeController.getSizeById)
  .put(sizeController.updateSize)
  .delete(sizeController.deleteSize);

module.exports = router;
