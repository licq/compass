'use strict';

var mongoose = require('mongoose'),
    Company = mongoose.model('Company'),
    _ = require('lodash');

exports.list = function (req, res, next) {
    Company.find({})
        .exec(function (err, companies) {
            if (err) return next(err);
            return res.json(companies);
        });
};

exports.get = function (req, res) {
    res.json(req.loadedCompany);
};

exports.load = function (req, res, next, id) {
    Company.findOne({_id: id})
        .select('name created')
        .exec(function (err, loadedCompany) {
            if (err) return next(err);
            if (!loadedCompany) return res.send(404, {message: 'not found'});
            req.loadedCompany = loadedCompany;
            next();
        });
};