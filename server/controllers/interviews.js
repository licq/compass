'use strict';

var mongoose = require('mongoose'),
  Interview = mongoose.model('Interview');

exports.list = function (req, res, next) {
  if (req.query.status === 'unprocessed') {
    Interview.unprocessedFor(req.user, function (err, interviews) {
      if (err) return next(err);
      res.json(interviews);
    });
  }
};

exports.get = function (req, res, next) {
  Interview.findOne({_id: req.params.id, company: req.user.company})
    .populate('events.interviewers', 'name')
    .populate('reviews.interviewer', 'name')
    .exec(function (err, interview) {
      if (err) return next(err);
      if (!interview) return res.json(404, {message: 'not found'});
      res.json(interview);
    });
};