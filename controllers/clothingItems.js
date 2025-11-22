const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
} = require("../utils/errorCodes");

// CREATE
const createItem = (req, res) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;
  // min and maxlength validation
  if (!name || name.length < 2) {
    return res.status(ERROR_BAD_REQUEST).send({ message: "Name too short" });
  }
  if (name.length > 30) {
    return res.status(ERROR_BAD_REQUEST).send({ message: "Name too long" });
  }
  return ClothingItem.create({
    name,
    imageUrl,
    weather,
    owner,
  })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Invalid item data" });
      }

      return res
        .status(ERROR_SERVER)
        .send({ message: "An error has occurred on the server." });
    });
};

// READ
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(() => {
      res
        .status(ERROR_SERVER)
        .send({ message: "An error has occured on the server" });
    });
};
//UPDATE
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((error) => {
      res
        .status(ERROR_SERVER)
        .send({ message: "Error from updateItem", error });
    });
};

// DELETE

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(ERROR_BAD_REQUEST)
      .send({ message: "Invalid item ID format" });
  }

  return ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(ERROR_NOT_FOUND).send({ message: "Item not found" });
      }

      // send the deleted item back as JSON
      return res.send(item);
    })
    .catch(() => {
      res
        .status(ERROR_SERVER)
        .send({ message: "An error has occurred on the server." });
    });
};

// like
const likeItem = (req, res) => {
  const { itemId } = req.params;

  // check if ID is valid
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(ERROR_BAD_REQUEST).send({ message: "Invalid item ID " });
  }

  // if ID is valid procees with database operation
  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } }, // add _id if not already present
    { new: true },
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_NOT_FOUND).send({ message: "Item not found" });
      }
      return res
        .status(ERROR_SERVER)
        .send({ message: "An error has occurred on the server" });
    });
};

// unlike
const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  // check if ID is valid
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(ERROR_BAD_REQUEST)
      .send({ message: "Invalid item ID format" });
  }
  // if ID is valid, proceed with database operation
  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } }, // remove the user's ID from likes
    { new: true },
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_NOT_FOUND).send({ message: "Item not found " });
      }
      return res
        .status(ERROR_SERVER)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  updateItem,
  likeItem,
  dislikeItem,
  createItem,
  getItems,
  deleteItem,
};
