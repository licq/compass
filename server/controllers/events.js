"use strict";

var mongoose = require('mongoose'),
  Event = mongoose.model('Event'),
  moment = require('moment');

exports.list = function (req, res, next) {
  var startTime = req.query.startTime || moment().startOf('week').toDate();
  var endTime = req.query.endTime || moment().endOf('week').toDate();

  var query = Event.where('time').gte(startTime).lt(endTime);
  if (req.user) {
    query.or([
      {'createdBy': req.user},
      {'interviewers': req.user}
    ]);
  }

  query.exec(function (err, results) {
    if (err) return next(err);
    return res.json(results);
  });
};

exports.create = function (req, res) {
  req.body.createdBy = req.user;
  req.body.createdByUserName = req.user.name;
  Event.create(req.body, function (err) {
    if (err) {
      res.send(400, {err: err});
    } else {
      res.send(200);
    }
  });
};
