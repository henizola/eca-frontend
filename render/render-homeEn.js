const EcaBanner = require("../models/banners-model");

const API = require("../api.js");

const renderHome = async (req, res) => {
  const sliders = await EcaBanner.find();

  res.render("index", { sliders: sliders, API: API });
};

module.exports = renderHome;
