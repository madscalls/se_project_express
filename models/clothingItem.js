const mongoose = require('mongoose');
const validator = require('validator');

const { ObjectId } = mongoose.Schema.Types;

const ClothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: { type: String, required: true, enum: ['hot', 'warm', 'cold'] }, // finite allowed data types
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value); // validation
      },
      message: 'Invalid URL format',
    },
  },
  owner: { type: ObjectId, ref: 'user', required: true }, // object identification for likes
  likes: {
    type: [{ type: ObjectId, ref: 'user' }],
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('clothingItems', ClothingItem);
