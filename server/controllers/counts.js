'use strict';

var mongoose = require('mongoose'),
  Resume = mongoose.model('Resume'),
  Interview = mongoose.model('Interview'),
  moment = require('moment'),
  async = require('async');

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
        if (group.length > 0)
          cb(null, group[0].total);
      });
    }
  };

  var queryFunctions = {};
  if (Array.isArray(req.query.counts)) {
    for (var i = 0; i < req.query.counts.length; i++) {
      queryFunctions[req.query.counts[i]] = countFunctions[req.query.counts[i]];
    }
  } else {
    queryFunctions[req.query.counts] = countFunctions[req.query.counts];
  }

  async.parallel(queryFunctions, function (err, counts) {
    if (err) return next(err);
    res.json(counts);
  });

//  var counts = {new: 0, undetermined: 0, pursued: 0,
//    eventsOfToday: 0, interviews: 0, reviews: 0};
//  Resume.count({company: req.user.company, status: 'new'}).exec()
//    .then(function (count) {
//      counts.new = count;
//      return Resume.count({company: req.user.company, status: 'pursued'}).exec();
//    })
//    .then(function (count) {
//      counts.pursued = count;
//      return Resume.count({company: req.user.company, status: 'undetermined'}).exec();
//    })
//    .then(function (count) {
//      counts.undetermined = count;
//      return Interview.countForUnReviewed(req.user, {});
//    })
//    .then(function (count) {
//      counts.toBeReviewed = count;
//      return Interview.countNew(req.user.company, {});
//    })
//    .then(function (count) {
//      counts.interviews = count;
//      var startTime = moment().startOf('day').toDate(),
//        endTime = moment().endOf('day').toDate();
//      return Interview.eventsCountForInterviewer(req.user._id, startTime, endTime);
//    })
//    .then(function (group) {
//      if (group.length > 0)
//        counts.eventsOfToday = group[0].total;
//      res.json(counts);
//    })
//    .then(null, function (err) {
//      if (err) return next(err);
//    });
};