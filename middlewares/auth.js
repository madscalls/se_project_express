const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/UnauthorizedError");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // No header or wrong format
  if (!authorization || !authorization.startsWith("Bearer ")) {
    // checks for bearer token
    throw new UnauthorizedError("Authorization required");
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next(); // on success adds req.user = payload
  } catch (err) {
    throw new UnauthorizedError("Authorization required");
  }
};
