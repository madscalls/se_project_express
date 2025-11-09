// routes/index.js
const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", itemRouter);

// 404 handler
router.use((req, res) => {
  res
    .status(ERROR_BAD_REQUEST)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
