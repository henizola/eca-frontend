const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');

const multer = require('multer');

const mongoose = require('mongoose');
const { admin, editor } = require('./super');
const EcaNews = new mongoose.model(
  'EcaNews',
  new mongoose.Schema({
    titleEn: {
      type: String,
      required: true,
    },
    titleAm: {
      type: String,
      required: true,
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
    newsImage: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    catagoryEn: {
      type: String,
      required: true,
    },
    catagoryAm: {
      type: String,
      required: true,
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
  { name: 'newsImage', maxCount: 1 },
]);
app.post(
  '/post-news', editor,
  cpUpload,
  async (req, res) => {
    let tdate = new Date();
    const date =
      tdate.getHours() +
      ':' +
      tdate.getMinutes() +
      ' ' +
      tdate.getDate() +
      '-' +
      (tdate.getMonth() + 1) +
      '-' +
      tdate.getFullYear();

    const news = new EcaNews({
      titleEn: req.body.titleEn,
      titleAm: req.body.titleAm,
      descriptionEn: req.body.descriptionEn,
      descriptionAm: req.body.descriptionAm,
      catagoryEn: req.body.catagoryEn,
      catagoryAm: req.body.catagoryAm,
      date: date,
      heroImage: req.files.heroImage[0].filename,
      newsImage: req.files.newsImage[0].filename,
    });
    const result = await news.save();

    res.send(result);
  }
);

app.post(
  '/edit-news', editor,
  cpUpload,
  async (req, res) => {
    let heroImage = '';
    let newsImage = '';
    console.log(req.body.oldHeroImage);
    const rmheroImage = path.join(
      __dirname,
      '..',
      'uploads',
      req.body.oldHeroImage
    );
    const rmnewsImage = path.join(
      __dirname,
      '..',
      'uploads',
      req.body.oldNewsImage
    );

    const news = await EcaNews.findById(
      req.body.id
    );

    if (!news)
      return res
        .status(404)
        .send('News Not Found');
    if (req.files.heroImage) {
      fs.unlink(rmheroImage, (err) => {
        if (err) res.status(500).send(err);
        else {
          return console.log(
            'hero image removed'
          );
        }
      });
      heroImage = req.files.heroImage[0].filename;
    } else {
      heroImage = req.body.heroImage;
    }

    if (req.files.newsImage) {
      fs.unlink(rmnewsImage, (err) => {
        if (err) res.status(500).send(err);
        else {
          return console.log('newsImage removed');
        }
      });
      newsImage = req.files.newsImage[0].filename;
    } else {
      newsImage = news.newsImage;
    }
    console.log(req.body.descriptionAm);
    news.set({
      titleEn: req.body.titleEn,
      titleAm: req.body.titleAm,
      descriptionEn: req.body.descriptionEn,
      descriptionAm: req.body.descriptionAm,
      catagoryEn: req.body.catagoryEn,
      catagoryAm: req.body.catagoryAm,
      heroImage: heroImage,
      newsImage: newsImage,
    });
    const result = await news.save();
    if (!result) {
      return res
        .status(500)
        .send('server Crushed');
    }
    res.send(result);
  }
);

app.post('/get-news', async (req, res) => {
  // findById(id);
  const news = await EcaNews.find();

  if (!news) {
    return res.status(404).send('News Not Found');
  }
  // console.log(news);
  res.send(news);
});
app.post('/get-detail-news', async (req, res) => {
  console.log(req.body.id);
  if (req.body.id) {
    const news = await EcaNews.findById(
      req.body.id
    );
    res.send(news);
  } else {
    res.status(404).send('not found');
  }

})
app.get('/get-today-news', async (req, res) => {
  const news = await EcaNews.find().sort({
    id: -1,
  });
  res.send(news);
});

app.post('/delete-news', editor, async (req, res) => {
  // findById(id);
  const news = await EcaNews.findOne({
    _id: req.body.id,
  });

  if (news) {
    const rmnewsImage = path.join(
      __dirname,
      '..',
      'uploads',
      news.newsImage
    );
    const rmheroImage = path.join(
      __dirname,
      '..',
      'uploads',
      news.heroImage
    );
    const deletedNews = await EcaNews.deleteOne(
      {
        _id: req.body.id,
      }
    );
    if (!deletedNews) {
      return res
        .status(404)
        .send('unable to  Delete');
    }
    fs.unlink(rmheroImage, (err) => {
      if (err) res.status(500).send(err);
    });
    fs.unlink(rmnewsImage, (err) => {
      if (err) res.status(500).send(err);
    });

    res.send(deletedNews);
  } else {
    res.status(404).send('news not found');
  }
});

module.exports = app;
