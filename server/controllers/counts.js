'use strict';

var mongoose = require('mongoose'),
  Resume = mongoose.model('Resume'),
  Interview = mongoose.model('Interview'),
  moment = require('moment');


exports.get = function (req, res, next) {
  var counts = {};

  Resume.count({status: 'new'}).exec()
    .then(function (count) {
      counts.new = count;
      return Resume.count({status: 'pursued'}).exec();
    })
    .then(function (count) {
      counts.pursued = count;
      return Resume.count({status: 'undetermined'}).exec();
    })
    .then(function (count) {
      counts.undetermined = count;
      return Interview.countForReview(req.user, {});
    })
    .then(function (count) {
      counts.reviews = count;
      return Interview.countForCompany(req.user.company, {});
    })
    .then(function (count) {
      counts.interviews = count;
      var startTime = moment().startOf('day').toDate(),
        endTime = moment().endOf('day').toDate();
      return Interview.eventsCountForInterviewer(req.user._id, startTime, endTime);
    }).then(function (group) {
      counts.eventsOfToday = group[0].total;
      res.json(counts);
    })
    .then(null, function (err) {
      if (err) return next(err);
    });
};