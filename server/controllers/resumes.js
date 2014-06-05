'use strict';

var mongoose = require('mongoose'),
  Resume = mongoose.model('Resume'),
  jobs = require('../tasks/jobs');

exports.list = function (req, res, next) {
  req.query.company = req.user.company;
  req.query.status = 'archived';
  Resume.query(req.query, function (err, results) {
    if (err) return next(err);
    return res.json(results);
  });
};

exports.get = function (req, res) {
  mongoose.model('Interview').findOne({application: req.resume._id})
    .populate('events.interviewers').populate('reviews.interviewer')
    .exec(function (err, interview) {
      if (interview) {
        req.resume = req.resume.toObject();
        req.resume.interview = interview;
      }
      return res.json(req.resume);
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