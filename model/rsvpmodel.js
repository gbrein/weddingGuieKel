const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RsvpModel = mongoose.model(
  "Rsvp",
  new Schema({
    names: String,
    confirmation: String,
    type_of_invitation: String,
    updated: { type: Date, default: Date.now() },
  })
);

module.exports = RsvpModel;