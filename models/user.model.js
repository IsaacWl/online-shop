const bcrypt = require('bcryptjs');
const db = require('../data/database');
const { ObjectId } = require('mongodb');

class User {
  constructor(user = {}) {
    this.email = user.email;
    this.password = user.password;
    this.fullname = user.fullname;
    this.address = {
      street: user.street,
      postalCode: user.postal,
      city: user.city,
    };
  }

  async signup() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    await db.getDb().collection('users').insertOne({
      email: this.email,
      password: hashedPassword,
      fullname: this.fullname,
      address: this.address,
    });
  }

  async login(email, password) {
    // ....
  }

  static findById(userId) {
    const uid = new ObjectId(userId);
    return db
      .getDb()
      .collection('users')
      .findOne({ _id: uid }, { projection: { password: 0 } });
  }

  async getUserWithSameEmail(email) {
    const user = await db.getDb().collection('users').findOne({ email: email });
    return user;
  }

  async existsAlready(email) {
    const existingUser = await this.getUserWithSameEmail(email);

    if (existingUser) return true;

    return false;
  }

  async comparePassword(plainPassword, hashedPassword) {
    const passwordsAreEqual = await bcrypt.compare(
      plainPassword,
      hashedPassword
    );
    return passwordsAreEqual;
  }
}

module.exports = User;
