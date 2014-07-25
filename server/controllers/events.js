"use strict";

var mongoose = require('mongoose'),
  Interview = mongoose.model('Interview'),
  User = mongoose.model('User'),
  moment = require('moment'),
  _ = require('lodash');

exports.list = function (req, res, next) {
  var startTime = moment(req.query.startTime).toDate() || moment().startOf('week').toDate();
  var endTime = moment(req.query.endTime).toDate() || moment().endOf('week').toDate();

  if (req.query.user) {
    Interview.eventsForInterviewer(req.query.user, startTime, endTime, req.query.pageSize,
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

exports.availableInterviewers = function (req, res, next) {
  Interview.findOne({application: req.query.application, company: req.user.company}).select('events').exec(function (err, interview) {
    if (err) return next(err);
    User.find({company: req.user.company, deleted: false}).select('name')
      .exec(function (err, users) {
        if (err) return next(err);
        var takenUsers;
        if (interview) {
          takenUsers = _.reduce(interview.events, function (result, event) {
            if (event.id !== req.query.id) {
              return result.concat(event.interviewers);
            } else {
              return result;
            }
          }, []);
        }

        users = _.filter(users, function (user) {
          return _.findIndex(takenUsers,function(t){
            return t.toString() === user.id;
          }) === -1;
        });

        res.json(users);
      });
  });
};