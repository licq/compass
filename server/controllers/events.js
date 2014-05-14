"use strict";

var mongoose = require('mongoose'),
  Event = mongoose.model('Event'),
  moment = require('moment'),
  _ = require('lodash');

exports.list = function (req, res, next) {
  var startTime = req.query.startTime || moment().startOf('week').toDate();
  var endTime = req.query.endTime || moment().endOf('week').toDate();

  var query = Event.where('startTime').gte(startTime).lt(endTime);
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

exports.load = function (req, res, next) {
  Event.findOne({_id: req.params.id, company: req.user.company})
    .exec(function (err, event) {
      if (err) return next(err);
      if (!event) return res.send(404, {message: 'not found'});
      req.event = event;
      next();
    });
};

exports.update = function (req, res, next) {
  _.merge(req.event, req.body);
  req.event.save(function (err) {
    if (err) return next(err);
    res.send(200);
  });
};

exports.delete = function (req, res, next) {
  req.event.remove(function (err) {
    if (err) return next(err);
    res.send(200);
  });
};

exports.create = function (req, res) {
  req.body.createdBy = req.user;
  Event.create(req.body, function (err) {
    if (err) {
      res.send(400, {err: err});
    } else {
      res.send(200);
    }
  });
};