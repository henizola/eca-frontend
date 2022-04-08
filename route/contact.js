const express = require('express');

const app = express();

const Joi = require('joi');

const mongoose = require('mongoose');
const { admin } = require('./super');
app.use(express.json());

const EcaContact = new mongoose.model(
  'EcaContact',
  new mongoose.Schema({
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gLocation: [
      {
        type: String,
        required: true,
      },
    ],
  })
);

const contactSchema = Joi.object({
  phone: Joi.string().required(),
  email: Joi.string().required(),
  address: Joi.string().required(),
  latitude: Joi.string().required(),
  longitude: Joi.string(),
  id: Joi.string(),
});

app.post('/add-contact', admin, async (req, res) => {
  let { error } = contactSchema.validate(
    req.body
  );

  if (error) {
    return res
      .status(400)
      .send(error.details[0].message);
  }
  let location = [];
  location.push(req.body.latitude);
  location.push(req.body.longitude);
  // const check = new EcaContact.findOne();
  const check = await EcaContact.find();
  console.log(check);
  if (check.length > 0) {
    return res.status(400).send("already registered");
  }
  const Contact = new EcaContact({
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
    gLocation: [...location],
  });

  const result = await Contact.save();

  res.send(result);
});

app.post('/get-contact', async (req, res) => {
  const Contact = await EcaContact.find();
  if (!Contact)
    return res
      .status(500)
      .send('there are no available Contacts');

  res.send(Contact);
});

app.post('/updateContact', admin, async (req, res) => {
  let { error } = contactSchema.validate(
    req.body
  );

  if (error) {
    return res
      .status(400)
      .send(error.details[0].message);
  }
  let location = [];
  location.push(req.body.latitude);
  location.push(req.body.longitude);

  const Contact = await EcaContact.updateOne({
    $set: {
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      gLocation: [...location],
    },
  });
  if (Contact.nModified) {
    res.send(Contact);
  } else {
    res
      .status(500)
      .send('contact is not modified');
  }
});

module.exports = app;
