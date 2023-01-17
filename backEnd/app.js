const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// donne accès au chemin du système de fichier
const path = require("path");
const app = express();
app.use(cors({ origin: "*" }));
const musicsRoutes = require("./routes/musics");
const namesRoutes = require("./routes/names");
const scoresRoutes = require("./routes/score");
const setMusics = require("./services/setMusics");

mongoose
  .connect(
    // adresse SRV qui contient l'utilisateur et le mot de passe MongoDB
    "mongodb+srv://userSong_10:2Gla86waiTxXois0@cluster0.hjsm4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

/* Ces headers permettent d'accéder à l'API depuis n'importe quelle origine,
d'ajouter les headers aux requêtes envoyées vers l'API,
d'envoyer des requêtes avec les méthodes indiquées */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());
// indique à express de gérer la ressource images de manière statique à chaque requête vers /images
app.use("/images", express.static(path.join(__dirname, "images")));
// indique à express de gérer la ressource music de manière statique à chaque requête vers /musics
app.use("/musics", express.static(path.join(__dirname, "musics")));
app.use("/api/musics", musicsRoutes);
app.use("/api/names", namesRoutes);
app.use("/api/scores", scoresRoutes);
setMusics();
module.exports = app;
