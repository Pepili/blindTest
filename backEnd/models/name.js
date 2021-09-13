const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const nameSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
});

nameSchema.plugin(uniqueValidator);
// exporter le modele
module.exports = mongoose.model("name", nameSchema);
