const router = require("express").Router();
const {
  logIn,
  createUser,
  getCurrentUser,
  updateUser,
} = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", updateUser);

module.exports = router;
