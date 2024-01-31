class HttpError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
  badRequest() {
    this.setMessage(this.message).setStatus(400);
    return this;
  }
  unAuthenticated() {
    this.setMessage(this.message).setStatus(401);
    return this;
  }
  unAuthorized() {
    this.setMessage(this.message).setStatus(403);
    return this;
  }
  notFound() {
    this.setMessage(this.message).setStatus(404);
    return this;
  }
  setMessage(message) {
    this.message = message;
    return this;
  }
  setStatus(code) {
    this.statusCode = code;
    return this;
  }
}

module.exports = HttpError;
