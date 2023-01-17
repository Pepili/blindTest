const models = require("../models/name");
const score = require("../models/score");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("../config/nodemailer.config");
const regex =
  /^[a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ' -]{2,20}$/;
const regexEmail =
  /^[a-zA-Z0-9.!#$%&'*+\\\/=?^_`{|}~\-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9\-]{2,63}$/;
const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

// creation de compte
exports.signup = (req, res) => {
  const pseudo = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const createAt = req.body.createAt;
  if (!regex.test(pseudo.trim()) || !regexEmail.test(email.trim())) {
    return res
      .status(410)
      .json({ error: "Veuillez remplir correctement les champs" });
  } else if (!regexPassword.test(password.trim())) {
    return res.status(401).json({
      error:
        "Le mot de passe doit contenir au moins 8 caractère avec une majuscule, une minuscule, un chiffre et un caractère spécial",
    });
  } else {
    bcrypt
      .hash(password, 10)
      .then((hash) => {
        new models({
          username: pseudo,
          email: email,
          password: hash,
          creataAt: createAt,
        })
          .save()
          .then((message) => {
            res.status(201).json({ message });
            nodemailer.sendConfirmationEmail(pseudo, email, message._id);
          })
          .catch((error) => {
            if (
              error.message ===
              "name validation failed: username: username must be unique"
            ) {
              return res.status(418).json({
                error: "Le pseudo existe déjà",
              });
            } else if (
              error.message ===
              "name validation failed: email: email must be unique"
            ) {
              return res.status(406).json({
                error: "Ce mail existe déjà",
              });
            } else if (
              error.message ===
                "name validation failed: username: username must be unique, email: email must be unique" ||
              error.message ===
                "name validation failed: email: email must be unique, username: username must be unique"
            ) {
              return res.status(408).json({
                error: "Ce pseudo et ce mail existe déjà",
              });
            } else {
              res.status(500).json({ error });
            }
          });
      })
      .catch((err) => res.status(404).json({ err }));
  }
};

// verifier mail
exports.verifyUser = (req, res) => {
  models
    .updateOne({ userId: req.params._id }, { $set: { status: "Active" } })
    .then(() => res.status(200).json({ message: "Utilisateur modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

//Envoyer mail pour changement de mdp
exports.mailChangePassword = (req, res) => {
  const email = req.body.email;
  models
    .findOne({ email: email })
    .then((message) => {
      if (!regexEmail.test(email.trim())) {
        res.status(400).json({ error: "le format n'est pas bon" });
      } else {
        res.status(201).json({ message });
        nodemailer.sendChangePassword(message.username, email, message._id);
      }
    })
    .catch((error) => res.status(401).json({ error }));
};

// Connexion à son compte
exports.login = (req, res) => {
  models
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(500).json({ error: "l'user n'existe pas..." });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ error: "Le mot de passe est erroné..." });
          } else if (user.status != "Active") {
            return res.status(400).json({
              error: "Votre compte n'est pas actif, vérifier votre boite mail",
            });
          }
          res.status(200).json({
            userId: user._id,
            // encodage d'un nouveau token signé valable 24h contenant l'userId en tant que payload
            token: jwt.sign({ userId: user._id }, "48BxSxkM37kb84CwcQ3T", {
              expiresIn: "24h",
            }),
            username: user.username,
          });
        })
        .catch((err) => res.status(500).json({ err }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Acces aux infos du compte
exports.profile = (req, res) => {
  models
    .findOne({ userId: req.params._id })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => res.status(404).json({ error }));
};

//modifier son compte
exports.updateProfile = async (req, res) => {
  const userObject = { ...req.body };
  if (
    (userObject.username && !regex.test(userObject.username.trim())) ||
    (userObject.email && !regexEmail.test(userObject.email.trim()))
  ) {
    res.status(400).json({ error: "Veuillez remplir correctement les champs" });
  }
  await models
    .updateOne(
      { userId: req.params._id },
      { ...userObject, userId: req.params._id }
    )
    .then((message) => {
      res.status(200).json({
        message,
      });
      if (userObject.email) {
        nodemailer.changeEmail(
          userObject.username,
          userObject.email,
          message._id
        );
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.updatePassword = async (req, res) => {
  const userPassword = req.body.password;
  if (userPassword == null || !regexPassword.test(userPassword.trim())) {
    return res.status(400).json({
      error:
        "Le mot de passe doit contenir au moins 8 caractère avec une majuscule, une minuscule, un chiffre et un caractère spécial",
    });
  }
  const userPasswordHashed = await bcrypt.hash(userPassword, 10);
  await models
    .updateOne(
      { userId: req.params._id },
      { $set: { password: userPasswordHashed } }
    )
    .then((message) => res.status(200).json({ message }))
    .catch((error) => res.status(500).json({ error }));
};

exports.deleteUser = async (req, res) => {
  // on supprime les scores du compte utilisateur
  const Score = score.find({ userId: req.params.userId });
  Score.deleteMany({ userId: req.params.userId })
    .then((message) => res.status(200).json({ message }))
    .catch((error) => res.status(400).json({ error }));

  /* const user = models.findOne({ userId: req.params._id });
  user
    .deleteOne({ userId: req.params._id })
    .then(() => res.status(200).json({ message: "Compte supprimé !" }))
    .catch((error) => res.status(400).json({ error })); */
};

exports.getAllScoresUser = (req, res) => {
  score
    .find({
      userId: req.body.userId,
    })
    .then((message) => res.status(200).json({ message }))
    .catch((err) => res.status(400).json({ err }));
};
