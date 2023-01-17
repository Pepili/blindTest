const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const musicSchema = mongoose.Schema({
  name: { type: String, required: true },
  musicUrl: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  type: { type: String, required: true },
  kind: { type: String },
});
musicSchema.plugin(uniqueValidator);
module.exports = mongoose.model("music", musicSchema);
