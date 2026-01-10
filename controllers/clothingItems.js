const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/BadRequestError");
const ServerError = require("../errors/ServerError");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");

// CREATE
const createItem = (req, res) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;
  if (!name || name.length < 2) {
    throw new BadRequestError("Name too short");
  }
  if (name.length > 30) {
    throw new BadRequestError("Name too long");
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
        throw new BadRequestError("Invalid item data");
      }
      throw new ServerError("An error has occurred on the server.");
    });
};

// READ
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(next);
  // => {
  //   throw new ServerError("An error has occurred on the server.");
  // });
};
// UPDATE
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch(() => {
      throw new ServerError("Error from updateItem");
    });
};

// DELETE

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ServerError("Invalid item ID format");
  }

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        throw new ServerError("Item not found");
      }

      if (!item.owner.equals(req.user._id)) {
        throw new ForbiddenError("Access denied");
      }

      return item.deleteOne().then((deletedItem) => res.send(deletedItem));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Invalid Item ID");
      }
      throw new ServerError("An error has occurred on the server.");
    });
};

// like
const likeItem = (req, res) => {
  const { itemId } = req.params;

  // check if ID is valid
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new BadRequestError("Invalid item ID ");
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
        throw new NotFoundError("Item not found");
      }
      throw new ServerError("An error has occurred on the server");
    });
};

// unlike
const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  // check if ID is valid
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new BadRequestError("Invalid item ID format");
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
        throw new NotFoundError("Item not found ");
      }
      throw new ServerError("An error has occurred on the server");
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
