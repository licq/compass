'use strict';

var mongoose = require('mongoose'),
  Resume = mongoose.model('Resume'),
  Position = mongoose.model('Position'),
  fs = require('fs'),
  path = require('path'),
  parser = require('../parsers/remoteResumeParser'),
  _ = require('lodash');

exports.list = function (req, res, next) {
  req.query.company = req.user.company;
  req.query.sort = [
    {
      applyDate: {order: 'desc'}
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
  Resume.findOne({_id: req.params.id, company: req.user.company})
    .exec(function (err, resume) {
      if (err) return next(err);
      if (!resume) return res.send(404, {message: 'not found'});
      req.resume = resume;
      next();
    });
};
exports.uploadResume = function (req, res, next) {
  var resume = new Resume(req.body);
  var applyPosition = resume.applyPosition;
  req.files.resumeFile.documentId = resume.id;
  resume.applyDate = new Date();
  resume.attach('resumeFile', req.files.resumeFile, function (err) {
    if (err) return next(err);
    fs.readFile(resume.resumeFile.url, function (err, data) {
      if (err) return next(err);
      parser.parse({
        attachments: [{
          content: new Buffer(data),
          fileName: req.files.resumeFile.originalFilename
        }]
      }, function (err, result) {
        if (err) return next(err);
        if (result && result.name && result.mobile) {
          resume = _.extend(resume, result);
          if (applyPosition)
            resume.applyPosition = applyPosition;
          Position.findOne({'aliases.name': resume.applyPosition}, function (err, position) {
            if (err) return next(err);
            if (position)
              resume.applyPosition = position.name;
            resume.company = req.user.company;
            resume.channel = '导入简历';
            resume.saveAndIndex(function (err) {
              if (err) return next(err);
              res.json({_id: resume._id});
            });
          });
        } else {
          res.json(400, {message: '抱歉，无法解析此简历'});
        }

      });
    });
  });
};

exports.download = function (req, res, next) {
  if (req.resume && req.resume.resumeFile) {
    res.download(req.resume.resumeFile.url, req.resume.resumeFile.name, function (err) {
      if (err) return next(err);
    });
  } else {
    res.send(404, {message: 'not found'});
  }
};