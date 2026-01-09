const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
// const { UNAUTHORIZED } = require("../errors/errorCodesRef");
const UnauthorizedError = require("../errors/UnauthorizedError");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // No header or wrong format
  if (!authorization || !authorization.startsWith("Bearer ")) {
    // checks for bearer token
    // return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
    throw new UnauthorizedError();
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next(); // on success adds req.user = payload
  } catch (err) {
    //  return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
    throw new UnauthorizedError();
  }
};
