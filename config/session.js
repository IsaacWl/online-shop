const MongoStore = require('connect-mongo');

function createSessionStore() {
  const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    dbName: process.env.DATABASE,
    collectionName: 'sessions',
  });

  return store;
}

function createSessionConfig() {
  return {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000,
    },
  };
}

module.exports = createSessionConfig;
