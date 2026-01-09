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
router.post("/", auth, validateClothingItem, validateId, createItem);

// READ
router.get("/", getItems);

// UPDATE
router.put("/:itemId", auth);

// DELETE

router.delete("/:itemId", auth, deleteItem);

router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
