const express = require("express");
const router = express.Router();
const scoreCtrl = require("../controllers/scores");

// creation score
router.post("/", scoreCtrl.createScore);

// récupération des scores
router.post("/recover", scoreCtrl.searchScore);

// supprimer scores
router.delete("/", scoreCtrl.deleteScore);

module.exports = router;
