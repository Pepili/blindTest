const mongoose = require("mongoose");

const scoreSchema = mongoose.Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
  type: { type: String, required: true },
  number: { type: Number, required: true },
});

// exporter le modele
module.exports = mongoose.model("score", scoreSchema);
