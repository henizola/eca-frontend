const express = require('express');

const app = express();

const mongoose = require('mongoose');
const { admin, editor } = require('./super');
const EcaYoutube = new mongoose.model(
  'EcaYoutube',
  new mongoose.Schema({
    youtube: {
      type: String,
      required: true,
    },
  })
);

app.post(
  '/add-youtube', admin,

  async (req, res) => {
    const youtube = new EcaYoutube({
      youtube: req.body.youtube,
    });
    const result = await youtube.save();
    res.send(result);
  }
);

app.post('/edit-youtube', admin, async (req, res) => {
  let oldYoutube = await EcaYoutube.updateOne(
    {
      _id: req.body.id,
    },
    {
      $set: {
        youtube: req.body.youtube,
      },
    }
  );
  if (oldYoutube.nModified) {
    res.send(oldYoutube);
  } else {
    res
      .status(500)
      .send('New Slogan Same as Current Slogan');
  }
});

app.post('/get-youtube', async (req, res) => {
  let oldYoutube = await EcaYoutube.find();
  res.send(oldYoutube);
});

module.exports = app;
