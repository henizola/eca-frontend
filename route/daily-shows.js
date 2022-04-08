const express = require('express');
const path = require('path');
const app = express();

const fs = require('fs');

const multer = require('multer');

const mongoose = require('mongoose');
const { admin, editor } = require('./super');
// eca Daily schema

const EcaDailyShows = new mongoose.model(
  'EcaDailyShow',
  new mongoose.Schema({
    showTitleAm: {
      type: String,
      required: true,
    },
    showTitleEn: {
      type: String,
      required: true,
    },
    heroImage: {
      type: String,
      required: true,
    },
    descriptionAm: {
      type: String,
      required: true,
    },
    descriptionEn: {
      type: String,
      required: true,
    },
    videos: [
      {
        videoTitleAm: {
          type: String,
          required: true,
        },
        videoTitleEn: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
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
  { name: 'heroImage', maxCount: 1 },
]);

// creating dailyShow

app.post(
  '/add-dailyShow', editor,
  cpUpload,
  async (req, res) => {
    const dailyShow = new EcaDailyShows({
      showTitleEn: req.body.showTitleEn,
      showTitleAm: req.body.showTitleAm,
      descriptionAm: req.body.descriptionAm,
      descriptionEn: req.body.descriptionEn,
      heroImage: req.files.heroImage[0].filename,
    });
    const result = await dailyShow.save();
    res.send(result);
  }
);

// getting  specific show with its detail show name and videos  from database

app.post('/get-dailyShow', async (req, res) => {
  const dailyShow = await EcaDailyShows.findOne(
    {
      _id: req.body.id,
    }
  );

  res.send(dailyShow);
});
// getting  specific show with its detail show name and videos  from database

app.post('/get-video', async (req, res) => {
  if (!req.body.showId) {
    return res.status(400).send('bad request');
  }

  let vid = '';
  const dailyShow = await EcaDailyShows.findOne(
    {
      _id: req.body.showId,
    }
  );
  vid = dailyShow.videos.find(
    (vid) => vid._id == req.body.vidId
  );
  console.log('here', vid);

  res.send(vid);
});

// get all shows with there respective name hero image and description

app.post(
  '/get-all-dailyShows',
  async (req, res) => {
    const dailyShow = await EcaDailyShows.find().select(
      {
        showTitleEn: 1,
        showTitleAm: 1,

        heroImage: 1,
        descriptionEn: 1,
        descriptionAm: 1,
      }
    );

    res.send(dailyShow);
  }
);

// // deliting video from a given dailyShow

app.post('/delete-video', editor, async (req, res) => {
  const file = path.join(
    __dirname,
    '..',
    'uploads',
    req.body.url
  );
  let oldDailyShow = await EcaDailyShows.updateOne(
    {
      _id: req.body.tvId,
    },
    {
      $pull: {
        videos: { _id: req.body.videoId },
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
});

// // changing  Video from a given dailyShow

app.post(
  '/change-video', editor,
  cpUpload,
  async (req, res) => {
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
          'videos.$.url': req.files.video
            ? req.files.video[0].filename
            : req.body.vidUrl,
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
  '/change-hero-image', editor,
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
  '/change-show-name', editor,

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
  '/change-show-description', editor,

  async (req, res) => {
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

// adding new video to a dailyShow

app.post(
  '/add-video-to-dailyShow', editor,
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
  '/edit-show', editor,
  uploaddailyShow.single('newHeroImage'),
  async (req, res) => {
    let heroImage = '';
    const file = path.join(
      __dirname,
      '..',
      'uploads',
      req.body.oldHeroImage
    );

    const show = await EcaDailyShows.findById(
      req.body.id
    );


    if (!show)
      return res
        .status(404)
        .send('show Not Found');

    if (req.file) {

      fs.unlink(file, (err) => {
        if (err) res.status(500).send(err);
        else {
          return console.log(
            'hero image removed'
          );
        }
      });
      heroImage = req.file.filename;
    } else {
      heroImage = req.body.oldHeroImage;
    }


    const showu = await EcaDailyShows.updateOne(
      { _id: req.body.id }, {
      $set: {
        descriptionEn: req.body.descriptionEn,
        descriptionAm: req.body.descriptionAm,
        showTitleEn: req.body.showTitleEn,
        showTitleAm: req.body.showTitleAm,
        heroImage: heroImage,
      }
    }
    );


    if (!showu.n) {
      return res.status(301).send("failed");
    }
    res.send(showu);


  }
);

module.exports = app;
