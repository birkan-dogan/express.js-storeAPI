const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name must be provided"],
  },

  price: {
    type: Number,
    required: [true, "Product price must be provided"],
  },

  featured: {
    type: Boolean,
    default: false,
  },

  rating: {
    type: Number,
    default: 4.5,
    min: [0, "rating cannot be below 0"],
    max: [5, "rating cannot be above 5"],
  },

  createat: {
    type: Date,
    default: Date.now(),
  },

  company: {
    type: String,
    enum: {
      values: ["ikea", "liddy", "caressa", "marcos"],
      message: "{VALUE} is not supported",
    },
    required: [true, "Product company must be provided"],
  },
});

module.exports = mongoose.model("Product", productSchema);
