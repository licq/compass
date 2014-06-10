'use strict';
var Resume = require('mongoose').model('Resume');

exports.counts = function (req, res, next) {
  Resume.aggregate([
    {
      $group: {
        _id: {
          year: {$year: '$createdAtLocaltime'},
          month: {$month: '$createdAtLocaltime'},
          day: {$dayOfMonth: '$createdAtLocaltime'}
        },
        count: {
          $sum: 1
        }
      }
    },
    {
      $project: {
        year: '$_id.year',
        month: '$_id.month',
        day: '$_id.day',
        count: 1
      }
    }
  ]).exec(function (err, counts) {
    if (err) return next(err);
    res.json(counts);
  });
};