const Score = require("../models/score");

exports.createScore = (req, res) => {
  const name = req.body.username;
  const type = req.body.type;
  const score = req.body.score;
  const number = req.body.number;
  new Score({
    username: name,
    type: type,
    score: score,
    number: number,
  })
    .save()
    .then(() => res.status(201).json({ message: "Score enregistré" }))
    .catch((err) => res.status(500).json({ err }));
};

exports.searchOneScore = (req, res) => {
  Score.findOne({
    username: req.body.username,
    type: req.body.type,
    number: req.body.number,
  })
    .then((score) => res.status(200).json(score))
    .catch((err) => res.status(404).json({ err }));
};

exports.searchScore = (req, res) => {
  const { name, type, score, number } = req.body;
  const match = {};
  const pipeline = [];

  if (name) {
    match.name = name;
  }

  if (type) {
    match.type = type;
  }

  if (score) {
    match.score = score;
  }

  if (number) {
    match.number = number;
  }

  pipeline.push({ $match: match });

  Score.aggregate(pipeline)
    .then((scores) => res.status(200).json(scores))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteScore = (req, res) => {
  Score.findOne({
    username: req.body.username,
    type: req.body.type,
    number: req.body.number,
  })
    .then((score) => {
      score
        .deleteOne({ _id: req.body._id })
        .then(() => res.status(200).json({ message: "score supprimé" }))
        .catch((err) => res.status(400).json({ err }));
    })
    .catch(() =>
      res.status(500).json({ message: "impossible de trouver le score" })
    );
};
