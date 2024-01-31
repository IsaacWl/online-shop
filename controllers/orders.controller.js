const Order = require('../models/order.model');
const User = require('../models/user.model');

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);

    res.render('customer/orders/all-orders', {
      orders,
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  // ....
  const cart = res.locals.cart;
  let user;
  try {
    user = await User.findById(res.locals.uid);

    const order = {
      productData: cart,
      userData: user,
    };

    const newOrder = new Order(order);
    await newOrder.save();
  } catch (error) {
    return next(error);
  }

  req.session.cart = null;

  res.redirect('/orders');
}

module.exports = {
  getOrders,
  addOrder,
};
