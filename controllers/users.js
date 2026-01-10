// const { get } = require('mongoose');
const bcrypt = require("bcryptjs"); // importing bcrypt
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

// errors
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ServerError = require("../errors/ServerError");
// const CreatedRes = require("../errors/CreatedRes");
// create

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password || !name || !avatar) {
    throw new BadRequestError("Invalid user data");
  }

  // password hashing
  return bcrypt
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
      res.status(201).send({ data: userObject });
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictError("That e-mail is already being used");
      }
      if (err.name === "ValidationError") {
        throw new BadRequestError("Invalid user data");
      }
      throw new ServerError("An error occurred on the server");
    })
    .catch(next);
};

// login
const logIn = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  return User.findUserByCredentials(email, password) // bcrypt.compare to check pass
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token }); // adds token on succsess
    })
    .catch(() => {
      throw new UnauthorizedError("Incorrect email or password");
    })
    .catch(next);
};

// GET /users/:userId
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError("User not found");
      }
      if (err.name === "CastError") {
        throw new BadRequestError("User not found");
      }

      throw new ServerError("An error occurred on the server");
    })
    .catch(next);
};

//
// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(OK).send(users))
//     .catch(() => {
//       res
//         .status(ServerError
// )
//         .send({ message: 'An error occurred on the server' });
//     });
// };

// const getUser = (req, res) => {
//   const { userId } = req.params;

//   User.findById(userId)
//     .orFail()
//     .then((user) => res.status(OK).send(user))
//     .catch((err) => {
//       if (err.name === 'DocumentNotFoundError') {
//         return res.status(NotFoundError
// ).send({ message: 'User not found' });
//       }
//       if (err.name === 'CastError') {
//         return res
//           .status(BadRequestError  )
//           .send({ message: 'Invalid user ID' });
//       }
//       return res
//         .status(ServerError
// )
//         .send({ message: 'An error occurred on the server' });
//     });
// };

// updateuser
const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        throw new BadRequestError("Invalid user data ");
      }
      if (error.name === "DocumentNotFoundError") {
        throw new NotFoundError("User not found ");
      }
      throw new ServerError("Error on the server");
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  logIn,
  updateUser,
};
