const express = require('express');

const app = express();

const Joi = require('joi');

const mongoose = require('mongoose');

app.use(express.json());
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { admin } = require('./super');

const EcaAdmin = new mongoose.model(
  'EcaAdmin',
  new mongoose.Schema({
    userName: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      required: true,
    },
  })
);

app.post('/sign-up', async (req, res) => {

  let found = false;
  const admincheck = await EcaAdmin.find();
  admincheck.forEach((ad) => {
    if (ad.userName === req.body.userName) {
      found = true;
      return;
    }
  });
  const salt = await bcrypt.genSalt(5);
  let password = req.body.password;
  password = await bcrypt.hash(password, salt);
  if (found)
    return res.status(500).send('username taken');
  const admin = new EcaAdmin({
    userName: req.body.userName,
    password: password,
    role: req.body.role,
  });

  const result = await admin.save();
  console.log(result);
  res.status(200).send('done');
});

app.post('/get-admins', async (req, res) => {
  const admin = await EcaAdmin.find().select({
    userName: 1,
    role: 1,
  });
  console.log(admin);
  if (!admin)
    return res
      .status(500)
      .send('there are no available admins');

  res.send(admin);
});

app.post('/sign-in', async (req, res) => {
  console.log(
    req.body.userName,
    req.body.password
  );
  const admin = await EcaAdmin.findOne({
    userName: req.body.userName,
  });

  if (!admin) {
    return res
      .status(400)
      .send('user name or password not correct');
  }

  const id = admin._id;
  const validPassword = await bcrypt.compare(
    req.body.password,
    admin.password
  );
  if (validPassword) {
    console.log(admin._id.toString());
    const token = jwt.sign(
      {
        id: admin._id.toString(),
        role: admin.role,
      },
      process.env.JWT_SECRET
    );

    res.cookie('auth', token).send(token);
    console.log(req.cookies);
    // res.status(200).send(admin);
  } else {
    res
      .status(500)
      .send(
        'user name or password not correct after'
      );
  }
});
app.post(
  '/delete-admin-editor',
  admin,
  async (req, res) => {
    const editor = await EcaAdmin.deleteOne({
      userName: req.body.userName,
    });
    if (editor.n)
      return res
        .status(200)
        .send('success fully deleted');
    else {
      return res
        .status(404)
        .send('user Not Found');
    }
  }
);

module.exports = app;
