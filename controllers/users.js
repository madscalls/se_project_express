// const { get } = require('mongoose');
const bcrypt = require("bcryptjs"); // importing bcrypt
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

//errors
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ServerError = require("../errors/ServerError");
const OkRes = require("../errors/OkRes");
const CreatedRes = require("../errors/CreatedRes");

// create

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password || !name || !avatar) {
    // return res.status(BadRequestError).send({ message: "Invalid user data" });
    throw new BadRequestError("Invalid user data");
    // tests
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
      // res.status(CreatedRes).send({ data: userObject });
      throw new CreatedRes();
    })
    .catch((err) => {
      if (err.code === 11000) {
        //return res;
        //    .status(ConflictError)
        //    .send({ message: "That e-mail is already being used" });
        throw new ConflictError();
      }
      if (err.name === "ValidationError") {
        //return res;
        //     .status(BadRequestError)
        //     .send({ message: "Invalid user data" });
        throw new BadRequestError();
      }
      //return res;
      //    .status(ServerError)
      //    .send({ message: "An error occurred on the server" });
      throw new ServerError();
    });
};

// login
const logIn = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    // return res.status(BadRequestError).json({
    //   message: "Email and password are required",
    // });
    throw new BadRequestError();
  }

  return User.findUserByCredentials(email, password) // bcrypt.compare to check pass
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token }); // adds token on succsess
    })
    .catch(() => {
      //res
      //  .status(UnauthorizedError)
      //  .send({ message: "Incorrect email or password" }); // error msg for fail
      throw new UnauthorizedError();
    });
};

// GET /users/:userId
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(OkRes).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        //  return res.status(NotFoundError).send({ message: "User not found" });
        throw new NotFoundError();
      }
      if (err.name === "CastError") {
        //  return res.status(BadRequestError).send({ message: "User not found" });
        throw new BadRequestError();
      }
      //  return res
      //    .status(ServerError)
      //    .send({ message: "An error occurred on the server" });
      throw new ServerError();
    });
};

//
// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(OK).send(users))
//     .catch(() => {
//       res
//         .status(ServerError
//)
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
//).send({ message: 'User not found' });
//       }
//       if (err.name === 'CastError') {
//         return res
//           .status(BadRequestError  )
//           .send({ message: 'Invalid user ID' });
//       }
//       return res
//         .status(ServerError
//)
//         .send({ message: 'An error occurred on the server' });
//     });
// };

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
    .then((user) => res.status(OkRes).send({ data: user }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        // return res
        //   .status(BadRequestError)
        //   .json({ message: "Invalid user data " });
        throw new BadRequestError();
      }
      if (error.name === "DocumentNotFoundError") {
        //  return res.status(NotFoundError).json({ message: "User not found " });
        throw new NotFoundError();
      }
      // return res.status(ServerError).json({ message: "Error on the server" });
      throw new ServerError();
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  logIn,
  updateUser,
};
