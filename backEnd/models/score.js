const mongoose = require("mongoose");
const today = new Date();
const dd = today.getDate();
const mm = today.getMonth() + 1;
const yyyy = today.getFullYear();
const createAt = dd + "/" + mm + "/" + yyyy;
const scoreSchema = mongoose.Schema({
  username: { type: String, required: true },
  userId: { type: String },
  score: { type: Number, required: true },
  type: { type: String, required: true },
  number: { type: Number, required: true },
  createAt: { type: String, default: createAt },
});

// exporter le modele
module.exports = mongoose.model("score", scoreSchema);
