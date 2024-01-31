const Cart = require('../models/cart.model');

function initializeCart(req, res, next) {
  let cart;

  if (!req.session.cart) {
    cart = new Cart();
  } else {
    const sessionCart = req.session.cart;
    cart = new Cart(sessionCart);
  }

  res.locals.cart = cart;

  next();
}

module.exports = initializeCart;
