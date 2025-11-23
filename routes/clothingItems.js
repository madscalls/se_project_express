const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  updateItem,
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require('../controllers/clothingItems');

// CREATE
router.post('/', auth, createItem);

// READ
router.get('/', getItems);

// UPDATE
router.put('/:itemId', auth, updateItem);

// DELETE

router.delete('/:itemId', auth, deleteItem);

router.put('/:itemId/likes', auth, likeItem);
router.delete('/:itemId/likes', auth, dislikeItem);

module.exports = router;
