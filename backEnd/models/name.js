const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const today = new Date();
const dd = today.getDate();
const mm = today.getMonth() + 1;
const yyyy = today.getFullYear();
const createAt = dd + "/" + mm + "/" + yyyy;
const nameSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Active"], default: "Pending" },
  createAt: { type: String, default: createAt },
});

nameSchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });
// exporter le modele
module.exports = mongoose.model("name", nameSchema);
