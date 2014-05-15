'use strict';

var EventSetting = require('mongoose').model('EventSetting'),
  _ = require('lodash');

exports.get = function (req, res, next) {
  EventSetting.findOne({company: req.user.company})
    .exec(function (err, eventSetting) {
      if (err) return next(err);
      res.json(eventSetting);
    });
};

exports.save = function (req, res, next) {
  EventSetting.findOne({company: req.user.company})
    .exec(function (err, eventSetting) {
      if (err) return next(err);
      if (eventSetting)
        _.merge(eventSetting, req.body);
      else {
        eventSetting = new EventSetting(req.body);
        eventSetting.createdBy = req.user._id;
        eventSetting.company = req.user.company;
      }
      eventSetting.save(function (err) {
        if (err) return next(err);
        res.send(200);
      });
    });
};