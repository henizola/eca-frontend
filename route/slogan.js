const express = require('express');

const app = express();

const mongoose = require('mongoose');
const { admin, editor } = require('./super');
const EcaSlogans = new mongoose.model(
  'EcaSlogans',
  new mongoose.Schema({
    sloganAm: {
      type: String,
      required: true,
    },
    sloganEn: {
      type: String,
      required: true,
    },
  })
);

app.post(
  '/add-slogan', admin,

  async (req, res) => {
    const slogan = new EcaSlogans({
      sloganAm: req.body.sloganAm,
      sloganEn: req.body.sloganEn,
    });
    const result = await slogan.save();
    res.send(result);
  }
);

app.post('/edit-slogan', admin, async (req, res) => {
  let oldSlogan = await EcaSlogans.updateOne(
    {
      _id: req.body.id,
    },
    {
      $set: {
        sloganAm: req.body.sloganAm,
        sloganEn: req.body.sloganEn,
      },
    }
  );
  if (oldSlogan.nModified) {
    res.send(oldSlogan);
  } else {
    res
      .status(500)
      .send('New Slogan Same as Current Slogan');
  }
});

app.post('/get-slogan', async (req, res) => {
  let oldSlogan = await EcaSlogans.find();
  res.send(oldSlogan);
});

module.exports = app;
