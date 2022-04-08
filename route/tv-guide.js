const express = require('express');
const path = require('path');
const app = express();

const multer = require('multer');

const mongoose = require('mongoose');
const { admin, editor } = require('./super');
const EcaTv = new mongoose.model(
  'EcaTv',
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      min: 10,
    },
    heroImage: {
      type: String,
      required: true,
    },
  })
);

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const now = new Date().toISOString(); const date = now.replace(/:/g, '-');
    cb(
      null,
      date + file.originalname
    );
  },
});
const upload = multer({ storage: storage });

var cpUpload = upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'tvImage', maxCount: 1 },
]);
app.post(
  '/post-tv', editor,
  cpUpload,
  async (req, res) => {
    const tv = new EcaTv({
      title: req.body.title,

      heroImage: req.files.heroImage[0].filename,
    });
    const result = await tv.save();

    res.send(result);
  }
);
app.get('/get-tvs', async (req, res) => {
  const tv = await EcaTv.find().sort({
    id: -1,
  });

  res.send(tv);
});

app.post(
  '/edit-tv', editor,
  cpUpload,
  async (req, res) => {
    let heroImage = '';

    const tv = await EcaTv.findById(
      req.body.id
    );

    if (!tv)
      return res.status(404).send('tv Not Found');
    if (req.files.heroImage) {
      heroImage = req.files.heroImage[0].filename;
    } else {
      heroImage = req.body.heroImage;
    }

    tv.set({
      title: req.body.title,

      heroImage: heroImage,
    });
    const result = await tv.save();
    if (!result) {
      return res
        .status(500)
        .send('server Crushed');
    }
    res.send(result);
  }
);

app.post('/get-tv', async (req, res) => {
  // findById(id);
  const tv = await EcaTv.find({
    _id: req.body.id,
  });

  if (!tv) {
    return res.status(404).send('Tv Not Found');
  }

  res.send(tv);
});

app.post('/delete-tv', editor, async (req, res) => {
  // findById(id);
  const tv = await EcaTv.deleteOne({
    _id: req.body.id,
  });

  if (!tv) {
    return res.status(404).send('Tv Not Found');
  }

  res.send(tv);
});

module.exports = app;
