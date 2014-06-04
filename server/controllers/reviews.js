'use strict';

var Interview = require('mongoose').model('Interview');

exports.list = function (req, res, next) {
  Interview.countForReview(req.user, req.query, function (err, count) {
    Interview.queryForReview(req.user, req.query, function (err, interviews) {
      if (err) return next(err);
      res.header('totalCount', count).json(interviews);
    });
  });
};

exports.create = function (req, res, next) {
  var review = req.body.review;
  Interview.findById(review.interview, function (err, interview) {
    review.interviewer = req.user;
    interview.reviews.push(review);
    interview.save(function (err) {
      if (err) return next(err);
      res.send(200);
    });
  });
};