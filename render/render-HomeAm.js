const EcaBanner = require('../models/banners-model')

const renderHomeAm =  async (req, res)  => {
    const sliders = await EcaBanner.find( );


  
    res.render("am",{ sliders: sliders });
  }

module.exports = renderHomeAm;