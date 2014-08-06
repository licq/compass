'use strict';
var Resume = require('mongoose').model('Resume'),
  _ = require('lodash'),
  async = require('async'),
  moment = require('moment');

exports.counts = function (req, res, next) {
  var aggregate = Resume.aggregate();
  var match = {company: req.user.company};
  if (req.query.applyPosition) match.applyPosition = req.query.applyPosition;
  if (req.query.channel) match.channel = req.query.channel;
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
    match.createdAt = {$gt: moment().subtract(12, 'w').endOf('day').toDate()};
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

exports.summaries = function (req, res, next) {
  var groupBys = req.query.groupBy;
  if (!Array.isArray(groupBys)) groupBys = [groupBys];
  async.mapSeries(groupBys, function (groupBy, cb) {
    var aggregate = Resume.aggregate()
      .match({company: req.user.company, createdAt: {$gte: moment().subtract(1, 'M').startOf('day').toDate()}});
    if (groupBy === 'age') {
      aggregate.match({birthday: {$exists: true}})
        .group({_id: {$year: '$birthday'}, count: {$sum: 1}})
        .project({
          name: {$subtract: [moment().year(), '$_id']},
          _id: 0,
          count: 1
        });
    } else {
      var g = {};
      g[groupBy] = {$exists: true};
      aggregate.match(g)
        .group({_id: '$' + groupBy, count: {$sum: 1}}).project({name: '$_id', _id: 0, count: 1});
    }
    aggregate.exec(cb);
  }, function (err, results) {
    if (err) return next(err);
    res.json(_.zipObject(groupBys, results));
  });
};