const express = require("express");
const router = express.Router();
const musicCtrl = require("../controllers/musics");

// récupération des musiques
router.post("/", musicCtrl.searchMusic);

module.exports = router;
