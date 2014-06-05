'use strict';

var mongoose = require('mongoose'),
  Resume = mongoose.model('Resume'),
  Interview = mongoose.model('Interview'),
  moment = require('moment'),
  async = require('async'),
  _ = require('lodash');

exports.get = function (req, res, next) {

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
    interviews: function (cb) {
      Interview.countNew(req.user.company, {}, cb);
    },
    toBeReviewed: function (cb) {
      Interview.countForUnReviewed(req.user, {}, cb);
    },
    eventsOfToday: function (cb) {
      var startTime = moment().startOf('day').toDate(),
        endTime = moment().endOf('day').toDate();
      Interview.eventsCountForInterviewer(req.user._id, startTime, endTime, function (err, group) {
        group.push({total: 0 });
        cb(null, group[0].total);
      });
    }
  };

  var queries = ['new', 'pursued', 'undetermined', 'eventsOfToday', 'toBeReviewed', 'interviews', ];

  if (req.query.counts) {
    if (Array.isArray(req.query.counts)) {
      queries = req.query.counts;
    }
    else {
      queries = [];
      queries.push(req.query.counts);
    }
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