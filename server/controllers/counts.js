'use strict';

var mongoose = require('mongoose'),
  Resume = mongoose.model('Resume'),
  Interview = mongoose.model('Interview'),
  moment = require('moment'),
  async = require('async'),
  _ = require('lodash');

exports.get = function (req, res, next) {
  var start = moment().startOf('day').toDate(),
    end = moment().endOf('day').toDate();

  var countFunctions = {
    new: function (cb) {
      Resume.count({company: req.user.company, status: 'new'}).exec(cb);
    },
    undetermined: function (cb) {
      Resume.count({company: req.user.company, status: 'undetermined'}).exec(cb);
    },
    pursued: function (cb) {
      Resume.count({company: req.user.company, status: 'pursued'}).exec(cb);
    },
    onboard: function (cb) {
      Interview.count({company: req.user.company, status: 'offer accepted'})
        .where('onboardDate').gte(start).lte(end).exec(cb);
    },
    interviews: function (cb) {
      Interview.countNew(req.user.company, {}, cb);
    },
    toBeReviewed: function (cb) {
      Interview.countForUnreviewed(req.user, cb);
    },
    eventsOfToday: function (cb) {
      Interview.eventsCountForInterviewer(req.user._id, start, end, cb);
    }
  };

  var queries = req.query.counts || ['new', 'pursued', 'undetermined', 'eventsOfToday', 'toBeReviewed', 'interviews'];

  if (!Array.isArray(queries)) {
    queries = [queries];
  }

  async.map(queries, function (query, cb) {
      if (countFunctions[query]) {
        countFunctions[query](cb);
      } else {
        cb(null, undefined);
      }
    }, function (err, counts) {
      if (err) return next(err);
      res.json(_.zipObject(queries, counts));
    }
  );
};