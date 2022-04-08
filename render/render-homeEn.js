const EcaBanner = require('../models/banners-model')

const renderHome =  async (req, res)  => {
    const sliders = await EcaBanner.find( );


  
    res.render("index",{ sliders: sliders });
  }

module.exports = renderHome;