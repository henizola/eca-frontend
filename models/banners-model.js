
const mongoose = require('mongoose');

const EcaBanner = new mongoose.model(
  'EcaBanner',
  new mongoose.Schema({
    bannerImage: {
      type: String,
      required: true,
    },
    titleAm: {
      type: String,
      required: true,
    },
    titleEn: {
      type: String,
      required: true,
    },
  })
);



  
  module.exports = EcaBanner;