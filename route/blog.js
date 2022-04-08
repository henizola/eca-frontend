const express = require('express');
const path = require('path');
const app = express();

const Joi = require('joi');

const multer = require('multer');

const mongoose = require('mongoose');
const { admin, editor } = require('./super');
const fs = require('fs');

const blogSchema = Joi.object({
  titleAm: Joi.string().required(),
  titleEn: Joi.string().required(),
  descriptionAm: Joi.string().required(),
  descriptionEn: Joi.string().required(),
  oldHeroImage: Joi.string(),
  oldBlogImage: Joi.string(),
  heroImage: Joi.string(),
  blogImage: Joi.string(),
  id: Joi.string(),
});

const idSchema = Joi.object({
  id: Joi.string().required(),
});

const EcaBlog = new mongoose.model(
  'EcaBlog',
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
    blogImage: {
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
  { name: 'blogImage', maxCount: 1 },
]);
app.post(
  '/post-blog', editor,
  cpUpload,
  async (req, res) => {
    if (
      !req.files ||
      !req.files.heroImage ||
      !req.files.blogImage
    ) {
      return res.status(400).send('bad request');
    }
    let { error } = blogSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .send(error.details[0].message);
    }
    const blog = new EcaBlog({
      titleAm: req.body.titleAm,
      titleEn: req.body.titleEn,
      descriptionAm: req.body.descriptionAm,
      descriptionEn: req.body.descriptionEn,
      heroImage: req.files.heroImage[0].filename,
      blogImage: req.files.blogImage[0].filename,
    });
    const result = await blog.save();

    res.send(result);
  }
);
app.post('/get-blogs', async (req, res) => {
  const { err } = idSchema.validate(req.body);
  if (err) {
    return res
      .status(400)
      .send(err.details[0].message);
  }
  const blog = await EcaBlog.find().sort({
    id: -1,
  });

  res.send(blog);
});

app.post(
  '/edit-blog', editor,
  cpUpload,
  async (req, res) => {
    const { error } = blogSchema.validate(
      req.body
    );
    if (error) {
      return res
        .status(400)
        .send(
          'olaaaaaaaa',
          error.details[0].message
        );
    }

    const hero = path.join(
      __dirname,
      '..',
      'uploads',
      req.body.oldHeroImage
    );

    const blogImg = path.join(
      __dirname,
      '..',
      'uploads',
      req.body.oldBlogImage
    );

    let heroImage = '';
    let blogImage = '';

    const blog = await EcaBlog.findById(
      req.body.id
    );
    if (!blog)
      return res
        .status(404)
        .send('blog Not Found');
    if (req.files.heroImage) {
      if (!req.body.oldHeroImage) {
        return;
      }
      fs.unlink(hero, (err) => {
        if (err) res.status(500).send(err);
      });
      heroImage = req.files.heroImage[0].filename;
    } else {
      heroImage = req.body.heroImage;
    }

    if (req.files.blogImage) {
      fs.unlink(blogImg, (err) => {
        if (err) res.status(500).send(err);
      });
      blogImage = req.files.blogImage[0].filename;
    } else {
      blogImage = blog.blogImage;
    }
    blog.set({
      titleAm: req.body.titleAm,
      titleEn: req.body.titleEn,
      descriptionAm: req.body.descriptionAm,
      descriptionEn: req.body.descriptionEn,
      heroImage: heroImage,
      blogImage: blogImage,
    });
    const result = await blog.save();
    if (!result) {
      return res
        .status(500)
        .send('server Crushed');
    } else {
      res.send(result);
    }
  }
);

app.post('/get-blog', async (req, res) => {
  if (!req.body.id) {
    return res.status(400).send('bad request');
  }

  const blog = await EcaBlog.find({
    _id: req.body.id,
  });

  if (!blog) {
    return res.status(404).send('Blog Not Found');
  }

  res.send(blog);
});

app.post('/delete-blog', editor, async (req, res) => {
  if (!req.body.id) {
    return res.status(400).send('bad request');
  }
  const blog = await EcaBlog.deleteOne({
    _id: req.body.id,
  });

  if (!blog) {
    return res.status(404).send('Blog Not Found');
  }

  res.send(blog);
});

// joi schema

module.exports = app;
