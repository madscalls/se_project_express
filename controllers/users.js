// const { get } = require('mongoose');
const bcrypt = require("bcryptjs"); // importing bcrypt
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
  CONFLICT,
  UNAUTHORIZED,
  CREATED,
  OK,
} = require("../utils/errorCodes");

// create

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  // password hashing
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        name,
        avatar,
        password: hash,
      }),
    )
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      res.status(CREATED).send({ data: userObject });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res
          .status(CONFLICT)
          .send({ message: "That e-mail is already being used" }); // email duplicate verification
      }
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Invalid user data" });
      }
      return res
        .status(ERROR_SERVER)
        .send({ message: "An error occurred on the server" });
    });
};

// login
const logIn = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(() => {
      res.status(UNAUTHORIZED).send({ message: "Incorrect email or password" });
    });
};

// GET /users/:userId
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "User not found" });
      }
      return res
        .status(ERROR_SERVER)
        .send({ message: "An error occurred on the server" });
    });
};

// updateuser
const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(OK).send({ data: user }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res
          .status(ERROR_BAD_REQUEST)
          .json({ message: "Invalid user data " });
      }
      if (error.name === "DocumentNotFoundError") {
        return res.status(ERROR_NOT_FOUND).json({ message: "User not found " });
      }
      return res.status(ERROR_SERVER).json({ message: "Error on the server" });
    });
};

module.exports = { createUser, getCurrentUser, logIn, updateUser };
