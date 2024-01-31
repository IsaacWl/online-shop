const { ObjectId } = require('mongodb');
const db = require('../data/database');
class Order {
  // status = pending, fulfilled, cancelled
  constructor(order = {}) {
    this.productData = order.productData;
    this.userData = order.userData;
    this.status = order.status || 'pending';
    this.date = new Date(order.date);
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    this.id = order._id;
  }

  static async findAll() {
    const orders = await db
      .getDb()
      .collection('orders')
      .find()
      .sort({ _id: -1 })
      .toArray();

    return this.formatOrders(orders);
  }

  static async findAllForUser(userId) {
    const uid = new ObjectId(userId);

    const orders = await db
      .getDb()
      .collection('orders')
      .find({ 'userData._id': uid })
      .sort({ _id: -1 })
      .toArray();

    return this.formatOrders(orders);
  }

  static async findById(orderId) {
    const order = await db
      .getDb()
      .collection('orders')
      .findOne({ _id: new ObjectId(orderId) });

    return this.formatOrder(order);
  }

  static formatOrder(order) {
    return new Order(order);
  }

  static formatOrders(orders) {
    return orders.map(this.formatOrder);
  }

  save() {
    // create order
    if (!this.id) {
      const orderDocument = {
        userData: this.userData,
        productData: this.productData,
        date: new Date(),
        status: this.status,
      };

      return db.getDb().collection('orders').insertOne(orderDocument);
    }
    // update order
    const orderId = new ObjectId(this.id);

    return db
      .getDb()
      .collection('orders')
      .updateOne({ _id: orderId }, { $set: { status: this.status } });
  }
}

module.exports = Order;
