"use strict";

var mongoose = require('mongoose'),
  Position = mongoose.model('Position'),
  EvaluationCriterion = mongoose.model('EvaluationCriterion');

exports.forReview = function (req, res, next) {
  Position.findOne({company: req.user.company, name: req.query.applyPosition}, function (err, position) {
    if (err) return next(err);
    if (position) {
      res.json({items: position.evaluationCriterions});
    } else {
      exports.get(req, res, next);
    }
  });
};

exports.get = function (req, res, next) {
  EvaluationCriterion.findOrCreate(
    req.user.company,
    function (err, criterion) {
      if (err) return next(err);
      res.json(criterion);
    });
};

exports.update = function (req, res, next) {
  EvaluationCriterion.findOrCreate(
    req.user.company,
    function (err, criterion) {
      if (err) return next(err);
      criterion.items = req.body.items;
      criterion.save(function (err) {
        if (err) return next(err);
        res.json(criterion);
      });
    }
  );
};