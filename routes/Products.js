const express = require('express');
const { createProduct, fetchAllProducts, fetchProductById, updateProduct, notifyUser, assignUser } = require('../controller/Product');

const router = express.Router();
//  /products is already added in base path
router.post('/', createProduct)
      .get('/', fetchAllProducts)
      .get('/:id', fetchProductById)
      .patch('/:id', updateProduct)
      .get('/notify/:userId/:productId',notifyUser)
      .get('/assign/:userId/:productId',assignUser)

exports.router = router;
