const router = require('express').Router();
const { getUsers, createUser, getUserById } = require('../controllers/users');

// CREATE

// READ

// UPDATE

// DELETE

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);

module.exports = router;
