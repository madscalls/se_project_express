const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "Invalid URL format for avatar",
    },
  },
  email: { type: String, required: true },
  password: { type: String, required: true, minlength: 8, select: false },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject(new Error("Incorrect email or password"));
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      return user; // now user is available
    });
  });
};

module.exports = mongoose.model("User", userSchema);
