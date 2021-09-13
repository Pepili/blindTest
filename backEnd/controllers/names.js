const models = require("../models/name");
const regex =
  /^[a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ' -]{2,20}$/;

exports.signup = (req, res) => {
  const pseudo = req.body.username;
  if (pseudo == "") {
    return res.status(400).json({ error: "please fill in field!" });
  } else if (!regex.test(pseudo.trim())) {
    return res
      .status(400)
      .json({ error: "please fill in the form field correctly" });
  } else {
    new models({
      username: pseudo,
    })
      .save()
      .then(() => res.status(201).json({ message: "username créé" }))
      .catch((error) => res.status(500).json({ error }));
  }
};
