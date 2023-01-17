const Score = require("../models/score");

exports.createScore = (req, res) => {
  const name = req.body.username;
  const userId = req.body.userId;
  const type = req.body.type;
  const score = req.body.score;
  const number = req.body.number;
  const createAt = req.body.createAt;
  new Score({
    username: name,
    userId: userId,
    type: type,
    score: score,
    number: number,
    createAt: createAt,
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
  const { username, type, score, number, userId, createAt } = req.body;
  const match = {};
  const pipeline = [];

  if (username) {
    match.username = username;
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

  if (userId) {
    match.userId = userId;
  }

  if (createAt) {
    match.createAt = createAt;
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
