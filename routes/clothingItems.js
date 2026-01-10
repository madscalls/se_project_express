const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CREATE
router.post("/", auth, validateClothingItem, createItem);

// READ
router.get("/", getItems);

// UPDATE
// router.put("/:itemId", auth);

// DELETE

router.delete("/:itemId", auth, validateId, deleteItem);

router.put("/:itemId/likes", auth, validateId, likeItem);
router.delete("/:itemId/likes", auth, validateId, dislikeItem);

module.exports = router;
