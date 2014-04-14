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