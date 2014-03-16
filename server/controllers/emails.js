'use strict';

var mongoose = require('mongoose'),
    Company = mongoose.model('Company');

exports.list = function (req, res, next) {
    Company.findById(req.user.companyId, function (err, company) {
        if (err) return next(err);
        return res.json(company.emails);
    });
};

exports.create = function (req, res, next) {
    var email = {
        address: req.body.address,
        account: req.body.account,
        password: req.body.password,
        server: req.body.server,
        port: req.body.port,
        secure: req.body.secure,
        ssl: req.body.ssl
    };
    Company.findById(req.user.companyId, function (err, company) {
        console.log(email);
        company.emails.push(email);
        company.save(function (err, saved) {
            if (err) return next(err);
            res.jsonp(saved);
        });
    });
};