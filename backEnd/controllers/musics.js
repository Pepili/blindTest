const Music = require("../models/music");

exports.searchMusic = (req, res) => {
  const { name, type, kind, random } = req.body;
  const match = {};
  const pipeline = [];

  if (name) {
    match.name = name;
  }

  if (type) {
    match.type = type;
  }

  if (kind) {
    match.kind = kind;
  }

  pipeline.push({ $match: match });
  if (random) {
    pipeline.push({ $sample: { size: random } });
  }

  Music.aggregate(pipeline)
    .then((musics) => res.status(200).json(musics))
    .catch((error) => res.status(400).json({ error }));
};
