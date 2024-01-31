const Product = require('../models/product.model');
const Order = require('../models/order.model');
async function getProducts(req, res, next) {
  try {
    const products = await Product.fetchProducts();

    res.render('admin/products/all-products', {
      products,
    });
  } catch (error) {
    next(error);
  }
}

function getNewProduct(req, res) {
  res.render('admin/products/new-product');
}

async function createNewProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    image: req.file.filename,
  });

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/admin/products');
}

async function getUpdateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);

    res.render('admin/products/update-product', { product });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  const product = new Product({ ...req.body, _id: req.params.id });
  if (req.file) {
    // replace the old image with new one
    product.replaceImage(req.file.filename);
  }
  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }
  res.redirect('/admin/products');
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    await product.remove();
  } catch (error) {
    return next(error);
  }

  res.json({ message: 'Deleted product' });
}

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAll();
    res.render('admin/orders/admin-orders', {
      orders,
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);

    order.status = newStatus;

    await order.save();

    res.json({ success: true, newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  getNewProduct,
  createNewProduct,
  getUpdateProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrder,
};
