'use strict';

var mongoose = require('mongoose'),
  _ = require('lodash'),
  Interview = mongoose.model('Interview');

exports.list = function (req, res, next) {
  if (!!req.query.review) {
    Interview.countForReview(req.user, req.query, function (err, count) {
      Interview.forReview(req.user, req.query, function (err, interviews) {
        if (err) return next(err);
        res.header('totalCount', count).json(interviews);
      });
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

exports.applyPositionsFor = function (req, res, next) {
  Interview.applyPositionsFor(req.user, function (err, positions) {
    if (err) return next(err);
    res.json(positions);
  });
};

exports.update = function (req, res, next) {
  Interview.findOne({_id: req.params.id, company: req.user.company})
    .exec(function (err, interview) {
      if (err) return next(err);
      if (!interview) return res.json(404, {message: 'not found'});
      var review = req.body.review;
      review.interviewer = req.user;
      review.createdAt = new Date();
      interview.reviews.push(review);
      interview.save(function (err) {
        if (err) return next(err);
        res.send(200);
      });
    });
};