const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const multer = require('multer');

const mongoose = require('mongoose');
////////////////////////////////////////////////////////////////
// const { auth } = require('./authentication');
const { admin, editor } = require('./super');
////////////////////////////////////////////////////////////////
 
const EcaDirectives = require('../models/directives-model')

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, path.join(__dirname, '..', 'directives'));
  },
  filename: function (req, file, cb) {
    const now = new Date().toISOString();
    const date = now.replace(/:/g, '-');
    cb(null, date + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post(
  '/add-directive',
  // editor,

  upload.single('directive'),
  async (req, res) => {

    
    if (!req.file) {
      return res
        .status(400)
        .send('Plese send a pdf');
    }

    var fileSizeInBytes = req.file.size;
 

    var fileSizeInMegabytes = fileSizeInBytes / (1024*1024);

    console.log('hre',fileSizeInMegabytes)
    const directive = new EcaDirectives({
      name: req.file.originalname,
      fileName:req.file.filename,
      size:fileSizeInMegabytes.toFixed(2)
    });
    const result = await directive.save();
    res.send(result);
  }
);



app.post('/get-directives', async (req, res) => {
  const ad = await EcaDirectives.find();
  
  res.status(200).send(ad);
});



app.post(
  '/change-directive',
  // editor,
  upload.single('directive'),
  async (req, res) => {

    if (!req.file || !req.body.id) {
      return res.status(400).send('bad request');
    }

    const directivess = await EcaDirectives.findOne({
      fileName: req.body.id,
    });

    const file = path.join(
      __dirname,
      '..',
      'directives',
      directivess.fileName
    );

    const feature = await EcaDirectives.updateOne(
      {
        _id: directivess._id,
      },
      {
        $set: { fileName: req.file.filename },
        $set: { name: req.file.originalname },
      }
    );
    if (feature.nModified) {
      fs.unlink(file, (err) => {
        if (err) res.status(500).send(err);
        else {
          return res.send(feature);
        }
      });
      // res.send(feature);
    } else {
      res.send(feature);
    }
  }
);

app.post(
  '/delete-directive',
  // editor,
  async (req, res) => {

    if (!req.body.name) {
      return res.status(400).send('bad request');
    }
    const file = path.join(
      __dirname,
      '..',
      'directives',
      req.body.name
    );
    const feature = await EcaDirectives.updateOne(
      {
      fileName: req.body.id,
      },
      {
        $set: { Directives: req.file.filename },
      }
    );
    if (feature.nModified) {
      fs.unlink(file, (err) => {
        if (err) res.status(500).send(err);
        else {
          return res.send(feature);
        }
      });
      // res.send(feature);
    } else {
      res.send(feature);
    }
  }
);


// app.post(
//   '/edit-ad',
//   editor,
//   upload.single('newDirectivesImage'),
//   async (req, res) => {
//     if (
//       !req.file ||
//       !req.body.id ||
//       !req.body.oldImage
//     ) {
//       return res.status(400).send('bad request');
//     }
//     const ad = await EcaDirectives.findOne({
//       _id: req.body.id,
//     });
//     console.log(ad);
//     const file = path.join(
//       __dirname,
//       '..',
//       'directives',
//       ad.Directives
//     );
//     const feature = await EcaDirectives.updateOne(
//       {
//         _id: req.body.id,
//       },
//       {
//         $set: { Directives: req.file.filename },
//       }
//     );
//     if (feature.nModified) {
//       fs.unlink(file, (err) => {
//         if (err) res.status(500).send(err);
//         else {
//           return res.send(feature);
//         }
//       });
//       // res.send(feature);
//     } else {
//       res.send(feature);
//     }
//   }
// );

// app.post(
//   '/delete-ad',
//   editor,
//   async (req, res) => {
//     console.log(req.body);
//     if (!req.body.id) {
//       return res.status(400).send('bad request');
//     }
//     const ad = await EcaDirectives.findOne({
//       _id: req.body.id,
//     });

//     if (ad) {
//       const file = path.join(
//         __dirname,
//         '..',
//         'directives',
//         ad.ad
//       );
//       const feature = await EcaDirectives.deleteOne({
//         _id: req.body.id,
//       });
//       if (feature.n) {
//         fs.unlink(file, (err) => {
//           if (err) res.status(500).send(err);
//           else {
//             return res.send(feature);
//           }
//         });
//       } else {
//         res.send('Unable to delete');
//       }
//     } else {
//       res.send('file not found');
//     }
//   }
// );

module.exports = app;
