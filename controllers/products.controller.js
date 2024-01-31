const Product = require('../models/product.model');

async function getAllProducts(req, res, next) {
  try {
    const products = await Product.fetchProducts();
    res.render('customer/products/all-products', { products });
  } catch (error) {
    next(error);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);

    res.render('customer/products/product-details', { product });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllProducts, getProduct };
