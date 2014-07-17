'use strict';

var ApplicationSetting = require('mongoose').model('ApplicationSetting'),
  _ = require('lodash');

exports.get = function (req, res, next) {
  ApplicationSetting.findOne({company: req.user.company})
    .exec(function (err, applicationSetting) {
      if (err) return next(err);
      res.json(applicationSetting);
    });
};

exports.save = function (req, res, next) {
  ApplicationSetting.findOne({company: req.user.company})
    .exec(function (err, applicationSetting) {
      if (err) return next(err);
      if (applicationSetting)
        _.merge(applicationSetting, req.body);
      else {
        applicationSetting = new ApplicationSetting(req.body);
        applicationSetting.company = req.user.company;
      }
      applicationSetting.save(function (err) {
        if (err) return next(err);
        res.send(200);
      });
    });
};