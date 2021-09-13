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
