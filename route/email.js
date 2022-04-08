const express = require('express');
const app = express();

const mongoose = require('mongoose');
const { admin, editor } = require('./super');
const EcaEmail = new mongoose.model(
  'EcaEmail',
  new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
  })
);

app.post(
  '/add-subscriber',

  async (req, res) => {
    console.log('called');
    const subscriber = new EcaEmail({
      email: req.body.email,
    });

    const result = await subscriber.save();
    res.send(result);
  }
);
app.post('/get-subscribers', async (req, res) => {
  const subscriber = await EcaEmail.find();
  res.send(subscriber);
});

app.post(
  '/delete-subscriber',
  admin,
  async (req, res) => {
    const subscriber = await EcaEmail.deleteOne(
      {
        _id: req.body.id,
      }
    );
    res.send(subscriber);
  }
);
module.exports = app;
