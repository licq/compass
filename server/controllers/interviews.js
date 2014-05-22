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