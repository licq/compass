'use strict';

var mongoose = require('mongoose'),
  Resume = mongoose.model('Resume'),
  Interview = mongoose.model('Interview'),
  moment = require('moment'),
  async = require('async'),
  _ = require('lodash');

exports.get = function (req, res, next) {
  var start = moment().startOf('day').toDate(),
    end = moment().endOf('day').toDate(),
    positions;
  if (req.user.positions && req.user.positions.length > 0) {
    positions = _.map(req.user.positions, 'name');
  }

  function resumeCount(options) {
    return function (cb) {
      var query = Resume.count({company: req.user.company, status: options.status});
      if (positions) {
        query.where('applyPosition').in(positions);
      }
      query.exec(cb);
    };
  }

  var countFunctions = {
    new: resumeCount({status: 'new'}),
    undetermined: resumeCount({status: 'undetermined'}),
    pursued: resumeCount({status: 'pursued'}),
    onboards: function (cb) {
      var query = Interview.count({company: req.user.company, status: 'offer accepted'})
        .where('onboardDate').gte(start).lte(end);
      if (positions) {
        query.where('applyPosition').in(positions);
      }
      query.exec(cb);
    },
    unreviewed: function (cb) {
      Interview.countForUnreviewed(req.user, cb);
    },
    eventsOfToday: function (cb) {
      Interview.eventsCountForInterviewer(req.user._id, start, end, function (err, group) {
        if (group && group.length > 0)
          cb(err, group[0].total);
        else cb(err, 0);
      });
    }
  };

  var queries = req.query.counts || ['new', 'pursued', 'undetermined', 'eventsOfToday', 'unreviewed'];

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