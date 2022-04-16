const EcaDirectives = require("../models/directives-model");

const API = require("../api.js");

const rednderDirectivesAm = async (req, res) => {
  const directives = await EcaDirectives.find({ name: /haric/i });

  console.log("here we have our directives", JSON.stringify(directives));

  //   res.status(200).send(ad);
  res.render("resourceAm", { directives: directives, API: API });
};

module.exports = rednderDirectivesAm;
