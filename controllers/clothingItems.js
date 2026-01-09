const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const { OK, CREATED } = require("../errors/errorCodesRef");
const BadRequestError = require("../errors/BadRequestError");
const ServerError = require("../errors/ServerError");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");

// CREATE
const createItem = (req, res) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;
  if (!name || name.length < 2) {
    //  return res.status(ERROR_BAD_REQUEST).send({ message: "Name too short" });
    throw new BadRequestError("Name too short");
  }
  if (name.length > 30) {
    //  return res.status(ERROR_BAD_REQUEST).send({ message: "Name too long" });
    throw new BadRequestError("Name too long");
  }
  return ClothingItem.create({
    name,
    imageUrl,
    weather,
    owner,
  })
    .then((item) => res.status(CREATED).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        //  return res
        //    .status(ERROR_BAD_REQUEST)
        //    .send({ message: "Invalid item data" });
        throw new BadRequestError();
      }

      //return res
      //  .status(ERROR_SERVER)
      //  .send({ message: "An error has occurred on the server." });
      throw new ServerError();
    });
};

// READ
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(OK).send(items))
    .catch(() => {
      //  res
      //    .status(ServerError)
      //    .send({ message: "An error has occured on the server" });
      throw new ServerError();
    });
};
// UPDATE
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(OK).send({ data: item }))
    .catch(() => {
      //  res.status(ERROR_SERVER).send({ message: "Error from updateItem" });
      throw new ServerError();
    });
};

// DELETE

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    // return res
    //   .status(ERROR_BAD_REQUEST)
    //   .send({ message: "Invalid item ID format" });
    throw new ServerError();
  }

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        //  return res.status(ERROR_NOT_FOUND).send({ message: "Item not found" });
        throw new ServerError();
      }

      if (!item.owner.equals(req.user._id)) {
        //    return res.status(FORBIDDEN).send({ message: "Access denied" });
        throw new ForbiddenError();
      }

      return item.deleteOne().then((deletedItem) => res.send(deletedItem));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        // return res
        //   .status(ERROR_BAD_REQUEST)
        //   .send({ message: "Invalid Item ID" });
        throw new BadRequestError();
      }
      //return res
      //  .status(ERROR_SERVER)
      //  .send({ message: "An error has occurred on the server." });
      throw new ServerError();
    });
};

// like
const likeItem = (req, res) => {
  const { itemId } = req.params;

  // check if ID is valid
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    // return res.status(ERROR_BAD_REQUEST).send({ message: "Invalid item ID " });
    throw new BadRequestError();
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
        //  return res.status(ERROR_NOT_FOUND).send({ message: "Item not found" });
        throw new NotFoundError();
      }
      //  return res
      //    .status(ERROR_SERVER)
      //    .send({ message: "An error has occurred on the server" });
      throw new ServerError();
    });
};

// unlike
const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  // check if ID is valid
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    // return res
    //   .status(ERROR_BAD_REQUEST)
    //   .send({ message: "Invalid item ID format" });
    throw new BadRequestError();
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
        // return res.status(ERROR_NOT_FOUND).send({ message: "Item not found " });
        throw new NotFoundError();
      }
      //return res
      //  .status(ERROR_SERVER)
      //  .send({ message: "An error has occurred on the server" });
      throw new ServerError();
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
