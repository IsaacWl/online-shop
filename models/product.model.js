const { ObjectId } = require('mongodb');
const HttpError = require('../util/errors');
const db = require('../data/database');

class Product {
  constructor(product) {
    this.title = product.title;
    this.summary = product.summary;
    this.price = +product.price;
    this.description = product.description;
    this.image = product.image; // the name of the image file
    this.updateImageData();

    if (product._id) {
      this.id = product._id.toString();
    }
  }

  static async fetchProducts() {
    const products = await db.getDb().collection('products').find({}).toArray();

    return products.map((product) => new Product(product));
  }

  static async findMultiple(ids) {
    const productIds = ids.map((id) => {
      return new ObjectId(id);
    });

    const products = await db
      .getDb()
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray();

    return products.map((productDocument) => {
      return new Product(productDocument);
    });
  }

  static async findById(productId) {
    let _id;
    try {
      _id = new ObjectId(productId);
    } catch (error) {
      // error.statusCode = 404;
      throw new HttpError(error.message).notFound();
    }
    const product = await db.getDb().collection('products').findOne({ _id });
    if (!product) {
      // const error = new Error(`Product was not found with id: ${productId}`);
      // error.statusCode = 404;
      throw new HttpError(
        `No product was found with id: ${productId}`
      ).notFound();
    }
    return new Product(product);
  }

  updateImageData() {
    this.imagePath = `products-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
    };
    // if not id then create product
    if (!this.id) {
      return await db.getDb().collection('products').insertOne(productData);
    }
    // if id then update product
    const productId = new ObjectId(this.id);

    if (!this.image) {
      delete productData.image;
    }

    return await db
      .getDb()
      .collection('products')
      .updateOne({ _id: productId }, { $set: productData });
  }

  async replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }

  remove() {
    const productId = new ObjectId(this.id);
    return db.getDb().collection('products').deleteOne({ _id: productId });
  }
}

module.exports = Product;
