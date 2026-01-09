class ServerError extends Error {
  constructor(message = "An error occurred on the server") {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = ServerError;
