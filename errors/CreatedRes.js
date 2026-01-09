class ConflictError extends Error {
  constructor(message = "succsessfully created") {
    super(message);
    this.statusCode = 201;
  }
}
module.exports = ConflictError;
