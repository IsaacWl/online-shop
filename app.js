const path = require('path');
const express = require('express');
const session = require('express-session');
// database
const db = require('./data/database');

const app = express();

require('dotenv').config();

// middlewares
const csrfMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');
const updateCartPricesMiddleware = require('./middlewares/update-cart-prices');
const notFoundMiddleware = require('./middlewares/not-found');
// routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.routes');
// config
const createSessionConfig = require('./config/session');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use('/products/assets', express.static('products-data'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// session middleware
const sessionConfig = createSessionConfig();
app.use(session(sessionConfig));

// initialize cart
app.use(cartMiddleware);
// if product is updated then updated carts
app.use(updateCartPricesMiddleware);

// add csrf tokens middleware
app.use(csrfMiddleware.addCsrfToken);
// check csrf tokens from requests
app.use(csrfMiddleware.checkCsrfToken);

app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', protectRoutesMiddleware, ordersRoutes);
app.use('/admin', protectRoutesMiddleware, adminRoutes);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;

(async () => {
  try {
    await db.connectToDatabase();
    app.listen(port, console.log(`Listening on port: ${port}`));
  } catch (error) {
    console.error(error);
  }
})();
