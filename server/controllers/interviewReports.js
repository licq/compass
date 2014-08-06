'use strict';

var Interview = require('mongoose').model('Interview'),
  moment = require('moment'),
  async = require('async'),
  _ = require('lodash');

exports.counts = function (req, res, next) {
  var aggregate = Interview.aggregate();
  var match = {company: req.user.company};
  if (req.query.applyPosition) match.applyPosition = req.query.applyPosition;
  if (req.query.reportType === 'day') {
    match.createdAt = {$gt: moment().subtract(1, 'M').endOf('day').toDate()};
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
    match.createdAt = {$gt: moment().subtract(12, 'weeks').endOf('day').toDate()};
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
    match.createdAt = {$gt: moment().subtract(1, 'years').endOf('day').toDate()};
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

exports.summaries = function (req, res, next) {
  var groupBys = req.query.groupBy;
  if (!Array.isArray(groupBys)) groupBys = [groupBys];
  async.mapSeries(groupBys, function (groupBy, cb) {
    Interview.aggregate()
      .match({company: req.user.company, createdAt: {$gte: moment().subtract(1, 'M').startOf('day').toDate()}})
      .group({_id: '$' + groupBy, count: {$sum: 1}}).project({name: '$_id', _id: 0, count: 1})
      .exec(cb);
  }, function (err, results) {
    if (err) return next(err);
    res.json(_.zipObject(groupBys, results));
  });
};