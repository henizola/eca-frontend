const express = require('express');
const path = require('path');
const app = express();

const multer = require('multer');

const mongoose = require('mongoose');

const fs = require('fs');
const { admin, editor } = require('./super');
const EcaWeeklyEditorial = new mongoose.model(
  'EcaWeeklyEditorial',
  new mongoose.Schema({
    titleEn: {
      type: String,
      required: true,
      min: 10,
    },
    titleAm: {
      type: String,
      required: true,
      min: 10,
    },
    heroImage: {
      type: String,
      required: true,
    },
    descriptionEn: {
      type: String,
      required: true,
    },
    descriptionAm: {
      type: String,
      required: true,
    },
    weeklyeditorialImage: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: new Date().toDateString(),
    },
  })
);

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(
      null,
      path.join(__dirname, '..', 'uploads')
    );
  },
  filename: function (req, file, cb) {
    const now = new Date().toISOString();
    const date = now.replace(/:/g, '-');
    cb(null, date + file.originalname);
  },
});
const upload = multer({ storage: storage });

var cpUpload = upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'weeklyeditorialImage', maxCount: 1 },
]);
app.post(
  '/post-weeklyeditorial', editor,
  cpUpload,
  async (req, res) => {
    const weeklyeditorial = new EcaWeeklyEditorial(
      {
        titleAm: req.body.titleAm,
        titleEn: req.body.titleEn,
        descriptionAm: req.body.descriptionAm,
        descriptionEn: req.body.descriptionEn,
        heroImage:
          req.files.heroImage[0].filename,
        weeklyeditorialImage:
          req.files.weeklyeditorialImage[0]
            .filename,
      }
    );
    const result = await weeklyeditorial.save();

    res.send(result);
  }
);
app.post(
  '/get-weeklyeditorials',
  async (req, res) => {
    const weeklyeditorial = await EcaWeeklyEditorial.find().sort(
      {
        id: -1,
      }
    );

    res.send(weeklyeditorial);
  }
);

app.post(
  '/edit-weeklyeditorial', editor,
  cpUpload,
  async (req, res) => {
    console.log('weeklyeditorialeditor');
    const hero = path.join(
      __dirname,
      '..',
      'uploads',
      req.body.oldHeroImage
    );

    const weeklyeditorialImg = path.join(
      __dirname,
      '..',
      'uploads',
      req.body.oldWeeklyEditorialImage
    );

    let heroImage = '';
    let weeklyeditorialImage = '';

    const weeklyeditorial = await EcaWeeklyEditorial.findById(
      req.body.id
    );
    console.log(weeklyeditorial);
    if (!weeklyeditorial)
      return res
        .status(404)
        .send('weeklyeditorialNot Found');
    if (req.files.heroImage) {
      fs.unlink(hero, (err) => {
        if (err) res.status(500).send(err);
        else console.log('removed');
      });
      heroImage = req.files.heroImage[0].filename;
    } else {
      heroImage = req.body.heroImage;
    }

    if (req.files.weeklyeditorialImage) {
      fs.unlink(weeklyeditorialImg, (err) => {
        if (err) res.status(500).send(err);
        else console.log('removed');
      });
      weeklyeditorialImage =
        req.files.weeklyeditorialImage[0]
          .filename;
    } else {
      weeklyeditorialImage =
        weeklyeditorial.weeklyeditorialImage;
    }
    weeklyeditorial.set({
      titleAm: req.body.titleAm,
      titleEn: req.body.titleEn,
      descriptionAm: req.body.descriptionAm,
      descriptionEn: req.body.descriptionEn,
      heroImage: heroImage,
      weeklyeditorialImage: weeklyeditorialImage,
    });
    const result = await weeklyeditorial.save();
    if (!result) {
      return res
        .status(500)
        .send('server Crushed');
    } else {
      console.log(result);
      res.send(result);
    }
  }
);

app.post(
  '/get-weeklyeditorial',
  async (req, res) => {
    // findById(id);
    const weeklyeditorial = await EcaWeeklyEditorial.find(
      {
        _id: req.body.id,
      }
    );

    if (!weeklyeditorial) {
      return res
        .status(404)
        .send('WeeklyEditorialNot Found');
    }

    res.send(weeklyeditorial);
  }
);

app.post(
  '/delete-weeklyeditorial', editor,
  async (req, res) => {
    // findById(id);
    const weeklyeditorial = await EcaWeeklyEditorial.deleteOne(
      {
        _id: req.body.id,
      }
    );

    if (!weeklyeditorial) {
      return res
        .status(404)
        .send('WeeklyEditorialNot Found');
    }

    res.send(weeklyeditorial);
  }
);

module.exports = app;
