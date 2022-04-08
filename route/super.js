const express = require('express');
const jwt = require('jsonwebtoken');
const checksuper = (req, res, next) => {
  const receivedToken = req.headers.token;
  const decodedToken = jwt.verify(
    receivedToken,
    process.env.JWT_SECRET,
    function (err, decode) {
      if (err) {
      
        return res
          .status(401)
          .send('access denaid');
      } else {
      
     
        if (decode.role === 'admin') next();
        else {
         
          return res
            .status(401)
            .send(
              "you don't have admin privileges"
            );
        }
      }
    }
  );
};
const checkEditor = (req, res, next) => {
  const receivedToken = req.body.token;
  const decodedToken = jwt.verify(
    receivedToken,
    process.env.JWT_SECRET,
    function (err, decode) {
      if (err)
        return res
          .status(401)
          .send('access denaid');
      else {
  
        req.user = decode;
        if (
          decode.role === 'editor' ||
          decode.role === 'admin'
        )
          next();
        else {
          return res
            .status(401)
            .send('you are not allowed to edit');
        }
      }
    }
  );
};
module.exports = {
  admin: checksuper,
  editor: checkEditor,
};
