'use strict';

var ccap = require('ccap')({
  width: 184,//set width,default is 256
  height: 40,//set height,default is 60
  offset: 30,//set text spacing,default is 40
  quality: 50,//set pic quality,default is 50
  fontsize: 32,//set font size,default is 57
});


exports.create = function (req, res) {
  var captcha = ccap.get();
  req.session.captcha = captcha[0];
  res.set('Content-Type', 'image/jpeg');
  res.send(captcha[1]);
};

exports.verify = function (req, res) {
  if (req.body.captcha && req.session.captcha && req.body.captcha.toLowerCase() === req.session.captcha.toLowerCase()) {
    res.send(200);
  } else {
    res.send(400);
  }
};