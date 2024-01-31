const Product = require('../models/product.model');

async function getCart(req, res) {
  // const cart = res.locals.cart;

  // await cart.updatePrices();

  res.render('customer/cart/cart');
}

async function addCartItem(req, res, next) {
  // ....
  let product;
  try {
    product = await Product.findById(req.body.productId);
  } catch (error) {
    next(error);
    return;
  }
  const cart = res.locals.cart;

  cart.addItem(product);
  req.session.cart = cart;

  res.status(201).json({
    success: true,
    newTotalItems: cart.totalQuantity,
  });
}

function updateCartItem(req, res) {
  const { productId, quantity } = req.body;
  const cart = res.locals.cart;

  const updatedItemData = cart.updateItem(productId, +quantity);

  req.session.cart = cart;

  res.json({
    success: true,
    updatedCartData: {
      newTotalQuantity: cart.totalQuantity,
      newTotalPrice: cart.totalPrice,
      updatedItemPrice: updatedItemData.updatedItemPrice,
    },
  });
}

module.exports = {
  addCartItem,
  getCart,
  updateCartItem,
};
