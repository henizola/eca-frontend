const express = require('express');
const path = require('path');
const app = express();

const fs = require('fs');

const multer = require('multer');

const mongoose = require('mongoose');
const { admin, editor } = require('./super');
// eca Daily schema

const EcaWeather = new mongoose.model(
  'EcaWeather',
  new mongoose.Schema({
    videos: [
      {
        date: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        youtube: {
          type: Boolean,
          required: true,
        }
      },
    ],
  })
);

// mlter for adding dates as a prefix from file name

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

// giving storage to multer

const uploaddailyShow = multer({
  storage: storage,
});

// schema for number of images on dailyShow

var cpUpload = uploaddailyShow.fields([
  { name: 'video', maxCount: 5 },
]);

// creating dailyShow

app.post(
  '/add-weather-video', editor,
  cpUpload,
  async (req, res) => {
    let weathervid = [];
    let url;
    let youtube;
    if (req.files.video) {
      url = req.files.video[0].filename;
      youtube = false;
    } else {
      url = req.body.youtube;
      youtube = true;
    }
    weathervid.push({
      date: new Date(),
      url: url,
      youtube: youtube,
    });

    const weather = new EcaWeather({
      videos: weathervid,
    });
    const result = await weather.save();
    res.send(result);
  }
);

// getting  specific show with its detail show name and videos  from database

app.post(
  '/get-weather-video',
  async (req, res) => {
    const weather = await EcaWeather.find();

    res.send(weather);
  }
);

// // deliting video from a given dailyShow

app.post(
  '/delete-weather-video', editor,
  async (req, res) => {
    const file = path.join(
      __dirname,
      '..',
      'uploads',
      req.body.url
    );
    const type = await EcaWeather.findOne({ _id: req.body.id });
    const deletedVideo = await EcaWeather.deleteOne(
      {
        _id: req.body.id,
      }
    );
    console.log(deletedVideo);
    if (deletedVideo.deletedCount && !(type.youtube)) {
      fs.unlink(file, (err) => {
        if (err) res.status(500).send(err);
        else {
          console.log('deleted');
          res.send(deletedVideo);
        }
      });
    } else {
      res.status(500).send('video not found');
    }
  }
);

// // changing  Video from a given dailyShow

app.post(
  '/change-video',
  cpUpload,
  async (req, res) => {
    console.log(req.body);
    const file = path.join(
      __dirname,
      '..',
      'uploads',
      req.body.vidUrl
    );
    let oldDailyShow = await EcaDailyShows.updateOne(
      {
        _id: req.body.tvId,
        'videos._id': req.body.videoId,
      },
      {
        $set: {
          'videos.$.url':
            req.files.video[0].filename,
          'videos.$.videoTitleAm':
            req.body.videoTitleAm,
          'videos.$.videoTitleEn':
            req.body.videoTitleEn,
          // videos: { _id: req.body.videoId },
        },
      }
    );

    if (oldDailyShow.nModified) {
      fs.unlink(file, (err) => {
        if (err) res.status(500).send(err);
        else {
          console.log('deleted');
          res.send(oldDailyShow);
        }
      });
    } else {
      res.status(500).send('video not found');
    }
  }
);
// change specific image on a dailyShow

app.post(
  '/change-hero-image',
  uploaddailyShow.single('newHeroImage'),
  async (req, res) => {
    const file = path.join(
      __dirname,
      '..',
      'uploaddailyShow',
      req.body.oldHeroImage
    );

    let oldDailyShow = await EcaDailyShows.updateOne(
      {
        _id: req.body.id,
      },
      {
        $set: { heroImage: req.file.filename },
      }
    );
    if (oldDailyShow.nModified) {
      fs.unlink(file, (err) => {
        if (err) res.status(500).send(err);
        else res.send('removed');
      });
      res.send(oldDailyShow);
    } else {
      res
        .status(500)
        .send(`Error image not Modified`);
    }
  }
);
//change show name
app.post(
  '/change-show-name',

  async (req, res) => {
    console.log(req.body);
    let oldDailyShow = await EcaDailyShows.updateOne(
      {
        _id: req.body.id,
      },
      {
        $set: {
          showTitleEn: req.body.showTitleEn,
          showTitleAm: req.body.showTitleAm,
        },
      }
    );
    if (oldDailyShow.nModified) {
      res.send(oldDailyShow);
    } else {
      res
        .status(500)
        .send(`Error Show Title not Modified`);
    }
  }
);

// change  Show description
app.post(
  '/change-show-description',

  async (req, res) => {
    console.log(req.body);
    let oldDailyShow = await EcaDailyShows.updateOne(
      {
        _id: req.body.id,
      },
      {
        $set: {
          descriptionEn: req.body.descriptionEn,
          descriptionAm: req.body.descriptionAm,
        },
      }
    );
    if (oldDailyShow.nModified) {
      res.send(oldDailyShow);
    } else {
      res
        .status(500)
        .send(`Error Show Title not Modified`);
    }
  }
);

// adding new images to a dailyShow

app.post(
  '/add-video-to-dailyShow',
  cpUpload,
  async (req, res) => {
    let oldDailyShow = await EcaDailyShows.updateOne(
      {
        _id: req.body.id,
      },
      {
        $push: {
          videos: {
            videoTitleAm: req.body.videoTitleAm,
            videoTitleEn: req.body.videoTitleEn,
            url: req.files.video[0].filename,
          },
        },
      }
    );

    if (oldDailyShow.nModified) {
      res.send(oldDailyShow);
    } else {
      res.status(500).send('Error server error');
    }
  }
);

app.post(
  '/edit-show',
  uploaddailyShow.single('newHeroImage'),
  async (req, res) => {
    let heroImage = '';
    const file = path.join(
      __dirname,
      '..',
      'uploaddailyShow',
      req.body.oldHeroImage
    );

    const show = await EcaDailyShows.findById(
      req.body.id
    );
    if (!show)
      return res
        .status(404)
        .send('show Not Found');

    if (req.file.newHeroImage) {
      fs.unlink(file, (err) => {
        if (err) res.status(500).send(err);
        else {
          return console.log(
            'hero image removed'
          );
        }
      });
      heroImage = req.file.newHeroImage.filename;
    } else {
      heroImage = req.body.oldHeroImage;
    }

    show.set({
      descriptionEn: req.body.descriptionEn,
      descriptionAm: req.body.descriptionAm,
      showTitleEn: req.body.showTitleEn,
      showTitleAm: req.body.showTitleAm,

      heroImage: heroImage,
    });

    const result = await show.save();
    if (!result) {
      // return res
      //   .status(500)
      //   .send('server Crushed');
      return console.log('crushed');
    }
    res.send(result);

    // let oldDailyShow = await EcaDailyShows.updateOne(
    //   {
    //     _id: req.body.id,
    //   },
    //   {
    //     $set: {
    //       descriptionEn: req.body.descriptionEn,
    //       descriptionAm: req.body.descriptionAm,
    //       showTitleEn: req.body.showTitleEn,
    //       showTitleAm: req.body.showTitleAm,
    //       heroImage: req.file.filename,
    //     },
    //   }
    // );
    // if (oldDailyShow.nModified) {
    //   fs.unlink(file, (err) => {
    //     if (err) res.status(500).send(err);
    //     else res.send('removed');
    //   });
    //   res.send(oldDailyShow);
    // } else {
    //   res
    //     .status(500)
    //     .send(`Error image not Modified`);
    // }
  }
);

// exporting

module.exports = app;
