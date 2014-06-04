"use strict";

var mongoose = require('mongoose'),
  Interview = mongoose.model('Interview'),
  moment = require('moment'),
  _ = require('lodash');

exports.list = function (req, res, next) {
  var startTime = moment(req.query.startTime).toDate() || moment().startOf('week').toDate();
  var endTime = moment(req.query.endTime).toDate() || moment().endOf('week').toDate();

  if (req.query.user) {
    console.log('events list');
    Interview.eventsForInterviewer(req.query.user, startTime, endTime,
      function (err, results) {
        if (err) return next(err);
        return res.json(results);
      });
  } else {
    Interview.eventsForCompany(req.user.company, startTime, endTime,
      function (err, results) {
        if (err) return next(err);
        return res.json(results);
      });
  }
};

exports.update = function (req, res, next) {
  Interview.updateEvent(req.params.id, req.body, function (err) {
    if (err) return next(err);
    res.send(200);
  });
};

exports.delete = function (req, res, next) {
  Interview.deleteEvent(req.params.id, function (err) {
    if (err) return next(err);
    res.send(200);
  });
};

exports.create = function (req, res) {
  req.body.createdBy = req.user;
  req.body.company = req.user.company;
  Interview.addEvent(req.body, function (err) {
    if (err) {
      res.send(400, {err: err});
    } else {
      res.send(200);
    }
  });
};