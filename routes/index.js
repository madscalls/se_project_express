// routes/index.js
const router = require('express').Router();
const userRouter = require('./users');
const itemRouter = require('./clothingItems');
const { ERROR_NOT_FOUND } = require('../utils/errorCodes');
const { logIn, createUser } = require('../controllers/users');

router.use('/users', userRouter);
router.use('/items', itemRouter);

// signin/signuproutes:
router.post('/signin', logIn);
router.post('/signup', createUser);

// 404 handler
router.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Requested resource not found' });
});

module.exports = router;
