"use strict";

var mongoose = require('mongoose'),
  EvaluationCriterion = mongoose.model('EvaluationCriterion');

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