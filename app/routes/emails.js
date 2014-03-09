'use strict';

var Company = require('../models/company');

module.exports = function (app) {
    app.get('/emails', function (req, res, next) {
        Company.findById(req.user.companyId, function (err, company) {
            if (err) return next(err);
            return res.jsonp(company.emails);
        });
    });

    app.post('/emails', function (req, res, next) {

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
    });
};