const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductStats
} = require('../controllers/productController');
const validateProduct = require('../middleware/validateProduct');

const router = express.Router();

// Routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/stats', getProductStats);
router.get('/:id', getProductById);
router.post('/products', validateProduct, createProduct);
router.put('/:id', validateProduct, updateProduct);
router.delete('/:id', deleteProduct);


module.exports = router;