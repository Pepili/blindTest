const Music = require("../models/music");

exports.searchMusic = (req, res) => {
  const { name, types, kinds, random } = req.body;
  const match = {};
  const pipeline = [];

  if (name) {
    match.name = name;
  }

  if (types && types.length > 0) {
    match.type = { $in: types };
  }

  if (kinds && kinds.length > 0) {
    match.kind = { $in: kinds };
  }

  pipeline.push({ $match: match });
  if (random) {
    pipeline.push({ $sample: { size: random } });
  }

  Music.aggregate(pipeline)
    .then((musics) => res.status(200).json(musics))
    .catch((error) => res.status(400).json({ error }));
};
