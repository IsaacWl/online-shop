const Product = require('./product.model');

class Cart {
  constructor(cart = {}) {
    this.items = cart.items || [];
    this.totalQuantity = cart.totalQuantity || 0;
    this.totalPrice = cart.totalPrice || 0;
  }

  addItem(product) {
    // to update single item from the cart
    const cartItem = {
      product,
      quantity: 1,
      totalPrice: product.price,
    };
    // if item is already in the cart
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.product.id === product.id) {
        cartItem.quantity = +item.quantity + 1;
        cartItem.totalPrice = item.totalPrice + product.price;

        // to get the updated properties
        this.items[i] = cartItem;

        this.updateCart(product);
        return;
      }
    }

    this.updateCart(product);
    // add updated single cart item
    this.items.push(cartItem);
  }

  updateCart(product) {
    this.totalQuantity++;
    this.totalPrice += product.price;
  }

  updateItem(productId, newQuantity) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.product.id === productId && newQuantity > 0) {
        const cartItem = { ...item };
        // calculate the changed quantity
        const quantityChange = newQuantity - item.quantity;

        cartItem.quantity = newQuantity;
        cartItem.totalPrice = newQuantity * item.product.price;

        this.items[i] = cartItem;

        this.totalQuantity = this.totalQuantity + quantityChange;
        this.totalPrice += quantityChange * item.product.price;

        return { updatedItemPrice: cartItem.totalPrice };
      }
      // delete if the newQuantity is less or equal 0
      if (item.product.id === productId && newQuantity <= 0) {
        this.items.splice(i, 1);
        this.totalQuantity = this.totalQuantity - item.quantity;
        this.totalPrice -= item.totalPrice;

        return { updatedItemPrice: 0 };
      }
    }
  }

  async updatePrices() {
    const productIds = this.items.map((item) => {
      return item.product.id;
    });

    const products = await Product.findMultiple(productIds);

    const deleteableCartItemProductIds = [];

    for (const cartItem of this.items) {
      const product = products.find((prod) => {
        return prod.id === cartItem.product.id;
      });

      if (!product) {
        // product deleted or no more available
        // "schedule" for removal from cart
        deleteableCartItemProductIds.push(cartItem.product.id);
        continue;
      }

      // product was not deleted
      // set product data and total price to latest price from database
      cartItem.product = product;
      cartItem.totalPrice = cartItem.quantity * cartItem.product.price;
    }

    // update cart items if product no more available
    if (deleteableCartItemProductIds.length > 0) {
      this.items = this.items.filter((item) => {
        return productIds.indexOf(item.product.id) < 0;
      });
    }

    // reset
    this.totalQuantity = 0;
    this.totalPrice = 0;

    // re-calculate cart totals
    for (const item of this.items) {
      this.totalQuantity = this.totalQuantity + item.quantity;
      this.totalPrice = this.totalPrice + item.totalPrice;
    }
  }
}

module.exports = Cart;
