'use strict';

var mongoose = require('mongoose'),
  Resume = mongoose.model('Resume'),
  path = require('path'),
  _ = require('lodash');

exports.list = function (req, res, next) {
  req.query.company = req.user.company;
  req.query.sort = [
    {
      createdAt: {order: 'desc'}
    }
  ];
  req.user.hasPositions(req.query.applyPosition, function (err, positions) {
    if (err) return next(err);
    req.query.applyPosition = positions;
    Resume.query(req.query, function (err, results) {
      if (err) return next(err);
      return res.json(results);
    });
  });
};

exports.get = function (req, res) {
  res.json(req.resume);
};

exports.update = function (req, res, next) {
  req.resume.status = req.query.status;
  req.resume.saveAndIndexSync(function (err) {
    if (err) return next(err);
    res.send(200);
  });
};

exports.load = function (req, res, next) {
  Resume.findOne({_id: req.params.id})
    .exec(function (err, resume) {
      if (err) return next(err);
      if (!resume) return res.send(404, {message: 'not found'});
      req.resume = resume;
      next();
    });
};

exports.uploadResume = function (req, res, next) {
  var resume = new Resume(req.body);
  resume.company = req.user.company;
  resume.channel = '导入简历';
  resume.attach('resumeFile', req.files.resumeFile, function(err){
    if(err) return next(err);
    resume.saveAndIndex(function (err) {
      if (err) return next(err);
      res.json({_id: resume._id});
    });
  });
};
