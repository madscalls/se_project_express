// routes/index.js
const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const NotFoundError = require("../errors/NotFoundError");
const { logIn, createUser } = require("../controllers/users");
const {
  validateAuthentication,
  validateUserBody,
} = require("../middlewares/validation");

router.use("/users", userRouter);
router.use("/items", itemRouter);

// signin/signuproutes:
router.post("/signin", validateAuthentication, logIn);
router.post("/signup", validateUserBody, createUser);

// 404 handler
router.use((req, res) => {
  throw new NotFoundError("Requested resource not found");
});

module.exports = router;
