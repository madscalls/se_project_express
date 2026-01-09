// routes/index.js
const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
// const { ERROR_NOT_FOUND } = require("../errors/errorCodesRef");
const NotFoundError = require("../errors/NotFoundError");
const { logIn, createUser } = require("../controllers/users");
const {
  validateAuthetication,
  validateUserBody,
} = require("../middlewares/validation");

router.use("/users", userRouter);
router.use("/items", itemRouter);

// signin/signuproutes:
router.post("/signin", validateAuthetication, logIn);
router.post("/signup", validateUserBody, createUser);

// 404 handler
router.use((req, res) => {
  //  res.status(ERROR_NOT_FOUND).send({ message: "Requested resource not found" });
  throw new NotFoundError("Requested resource not found");
});

module.exports = router;
