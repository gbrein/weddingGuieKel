const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreModel = mongoose.model(
  "Store",
  new Schema({
    name: String,
    photo: String,
    price: String,
    quote: Number,
    updated: { type: Date, default: Date.now() },
  })
);

module.exports = StoreModel;