const EcaDirectives = require("../models/directives-model");
const API = require("../api.js");

const rednderDirectivesEn = async (req, res) => {
  const directives = await EcaDirectives.find({ name: /nglish/i });

  console.log("here we have our directives", JSON.stringify(directives));

  //   res.status(200).send(ad);
  res.render("resource", { directives: directives, API: API });
};

module.exports = rednderDirectivesEn;
