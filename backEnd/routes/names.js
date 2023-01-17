const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/names");
const auth = require("../middlewares/auth");

// création de compte
router.post("/signup", userCtrl.signup);

// authentification de compte
router.post("/login", userCtrl.login);

//Profil de l'user
router.get("/:id", auth, userCtrl.profile);

//modification du compte
router.put("/:id", auth, userCtrl.updateProfile);

//Envoie mail mdp
router.post("/:id/mail", userCtrl.mailChangePassword);

//modification mot de passe
router.put("/:id/password", userCtrl.updatePassword);

//Suppression du compte
router.delete("/:id", auth, userCtrl.deleteUser);

// Tous les scores de l'user
router.post("/:id/scores", auth, userCtrl.getAllScoresUser);

//confirmation mail
router.put("/confirm/:id", userCtrl.verifyUser);

module.exports = router;
