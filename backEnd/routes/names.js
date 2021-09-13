const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/names");

// création de compte
router.post("/signup", userCtrl.signup);

module.exports = router;
