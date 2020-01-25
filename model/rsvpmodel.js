const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RsvpModel = mongoose.model(
  "Rsvp",
  new Schema({
    name: String,
    phone: String,
    email: String,
    updated: { type: Date, default: Date.now() },
  })
);

module.exports = RsvpModel;