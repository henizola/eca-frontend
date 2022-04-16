const EcaBanner = require("../models/banners-model");

const API = require("../api.js");

const renderHomeAm = async (req, res) => {
  const sliders = await EcaBanner.find();

  res.render("am", { sliders: sliders, API: API });
};

module.exports = renderHomeAm;
