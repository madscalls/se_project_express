const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
  validateClothingItem,
} = require("../controllers/clothingItems");

// CREATE
router.post("/", validateClothingItem, createItem);

// READ
router.get("/", getItems);

// UPDATE
router.put("/:itemId", auth);

// DELETE

router.delete("/:itemId", auth, deleteItem);

router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
