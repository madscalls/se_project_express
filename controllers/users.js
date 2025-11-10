// const { get } = require('mongoose');
const User = require("../models/user");
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

// create user
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "An error occurred on the server" });
      }
      return res
        .status(ERROR_SERVER)
        .send({ message: "An error occurred on the server" });
    });
};

// GET /users/:userId
const getUserById = (req, res) => {
  const { userId } = req.params;

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

module.exports = { getUsers, createUser, getUserById };
