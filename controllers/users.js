// const { get } = require('mongoose');
const User = require("../models/user");
const bcrypt = require("bcryptjs"); // importing bcrypt
const JWT_SECRET = require("../utils/config");
const jwt = require("jsonwebtoken");

const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
} = require("../utils/errorCodes");

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_SERVER)
        .send({ message: "An error has occurred on the server" });
    });
};

//create

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  //password hashing
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        email,
        name,
        avatar,
        password: hash,
      });
    })
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      res.status(201).send({ data: userObject });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res
          .status(409)
          .send({ message: "That e-mail is already being used" }); //email duplicate verification
      }
      if (err.name === "ValidationError") {
        console.log("validation error:", err.message);
        console.log("full err", err);
        return res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "An error occurred on the server" });
      }
      return res
        .status(ERROR_SERVER)
        .send({ message: "An error occurred on the server" });
    });
};

//login
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
      res.status(401).send({ message: "Incorrect email or password" });
    });
};

// GET /users/:userId
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: "An error occurred on the server" });
      }
      if (err.name === "CastError") {
        return res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "An error occurred on the server" });
      }
      return res
        .status(ERROR_SERVER)
        .send({ message: "An error occurred on the server" });
    });
};

//updateuser
const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidator: true },
  )
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((error) => {
      res
        .status(ERROR_SERVER)
        .send({ message: "Error updating profile name/avatar", error });
    });
};

module.exports = { getUsers, createUser, getCurrentUser, logIn, updateUser };
