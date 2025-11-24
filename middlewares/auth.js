// const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require("../utils/config");
// const { UNAUTHORIZED, FORBIDDEN } = require("../utils/errorCodes");

// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;
//   if (!authorization) {
//     return res.status(FORBIDDEN).send({ message: "Authorization required " });
//   }
//   const token = authorization.replace("Bearer ", "");

//   try {
//     const payload = jwt.verify(token, JWT_SECRET);
//     req.user = payload;
//     return next();
//   } catch (err) {
//     return res.status(UNAUTHORIZED).send({ message: "Invalid token" });
//   }
// };
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errorCodes");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // No header or wrong format
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }
};
