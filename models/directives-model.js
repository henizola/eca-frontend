
const mongoose = require('mongoose');

const  EcaDirectives = new mongoose.model(
    'EcaDirectives',
    new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      fileName: {
        type: String,
        required: true,
      },
      size:{
        type:Number,
        required:true
      }
    })
  );


  
  module.exports = EcaDirectives;