'use strict';
var Resume = require('mongoose').model('Resume'),
  _ = require('lodash'),
  moment = require('moment');

exports.counts = function (req, res, next) {
  var aggregate = Resume.aggregate();
  var match = {company: req.user.company};
  if (req.query.applyPosition) match.applyPosition = req.query.applyPosition;
  if (req.query.channel) match.channel = req.query.channel;
  if (req.query.reportType === 'day') {
    match.createdAt = {$gt: moment().add('months', -1).endOf('day').toDate()};
    aggregate.match(match);
    aggregate.group({
        _id: {
          year: {$year: '$createdAtLocaltime'},
          month: {$month: '$createdAtLocaltime'},
          day: {$dayOfMonth: '$createdAtLocaltime'}
        },
        count: {
          $sum: 1
        }
      }
    ).project({
        year: '$_id.year',
        month: '$_id.month',
        day: '$_id.day',
        count: 1,
        _id: 0
      });
  } else if (req.query.reportType === 'week') {
    match.createdAt = {$gt: moment().add('weeks', -12).endOf('day').toDate()};
    aggregate.match(match).group({
      _id: {
        year: {$year: '$createdAtLocaltime'},
        week: {$week: '$createdAtLocaltime'}
      },
      count: {
        $sum: 1
      }
    }).project({
      _id: 0,
      year: '$_id.year',
      week: {$add: ['$_id.week', 1]},
      count: 1
    });
  } else {
    match.createdAt = {$gt: moment().add('years', -1).endOf('day').toDate()};
    aggregate.match(match).group({
      _id: {
        year: {$year: '$createdAtLocaltime'},
        month: {$month: '$createdAtLocaltime'}
      },
      count: {
        $sum: 1
      }
    }).project({
      _id: 0,
      year: '$_id.year',
      month: '$_id.month',
      count: 1
    });
  }
  aggregate.exec(function (err, counts) {
    if (err) return next(err);
    res.json(counts);
  });
};

exports.applyPositions = function (req, res, next) {
  Resume.distinct('applyPosition')
    .where({company: req.user.company})
    .exec(function (err, applyPositions) {
      if (err) return next(err);
      res.json(applyPositions);
    });
};

exports.channels = function (req, res, next) {
  Resume.distinct('channel')
    .where({company: req.user.company})
    .exec(function (err, channels) {
      if (err) return next(err);
      res.json(channels);
    });
};