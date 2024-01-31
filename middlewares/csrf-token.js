const Tokens = require('csrf');

const tokens = new Tokens();

function addCsrfToken(req, res, next) {
  // secret should be different for each request
  // req.session.csrfSecret with a different secret for each session
  res.locals._csrf = tokens.create(process.env.CSRF_SECRET);
  next();
}

function checkCsrfToken(req, res, next) {
  const secret = process.env.CSRF_SECRET;
  const error = new Error('invalid csrf');
  error.statusCode = 401;
  if (req.body._csrf) {
    if (!tokens.verify(secret, req.body._csrf)) {
      return next(error);
    }
  }
  if (req.query._csrf) {
    if (!tokens.verify(secret, req.query._csrf)) {
      return next(error);
    }
  }
  next();
}

module.exports = { addCsrfToken, checkCsrfToken };
