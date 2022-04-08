const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
////////////////////////////////////////////////////////////////////
const cookieParser = require('cookie-parser');
dotenv.config({ path: './config.env' });
////////////////////////////////////////////////////////////////////
const signin = require('./route/sign-in');
const news = require('./route/news');
const blog = require('./route/blog');
const directives = require('./route/directives');
const tv = require('./route/tv-guide');
const contact = require('./route/contact');
const gallary = require('./route/galary');
const email = require('./route/email');
const slogan = require('./route/slogan');
// ////////////////////////////////////////////////////////////////////////
// const { apps } = require('./route/authentication');
// const test = require('./route/test');
// ////////////////////////////////////////////////////////////////////////////
const youtube = require('./route/youtube');

const weather = require('./route/weathers');

const weekly = require('./route/weekly');

const app = express();

const dailyShow = require('./route/daily-shows');

const livePromo = require('./route/live-promo');

app.use(cors());
////////////////////////////////////////////////////////////////////////
app.use(cookieParser());

mongoose
  .connect('mongodb://localhost/eca-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() =>
    console.log('Connected to MongoDb ...')
  )
  .catch((error) =>
    console.log(
      'could not connect to database' + error
    )
  );

app.use(express.static('uploads'));
app.use(express.static('directives'));
app.use(express.static('uploadgallery'));
app.use(express.static('ads'));

app.use(express.json());
// console.log(process.env);
app.use('/api', signin);
app.use('/api', news);
app.use('/api', directives);
app.use('/api', blog);
app.use('/api', tv);
app.use('/api', gallary);
app.use('/api', slogan);

app.use('/api', email);
app.use('/api', dailyShow);

app.use('/api', contact);
app.use('/api', weather);
app.use('/api', weekly);
app.use('/api', youtube);
app.use('/api', livePromo);
// ////////////////////////////////
// app.use(apps);
// app.use(test);
// //////////////////////////////////////////////////////////////
const port = process.env.PORT || 9000;
app.listen(port, () =>
  console.log(`listening to port ${port}`)
);
