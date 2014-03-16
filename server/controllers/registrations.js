'use strict';

var mongoose = require('mongoose'),
    Registration = mongoose.model('Registration'),
    _ = require('lodash');


exports.create = function (req, res) {
    var registration = new Registration(req.body);

    registration.save(function (err) {
        if (err) {
            _.merge(req.flash, {
                registration: registration,
                errors: err.errors
            });
            return res.redirect('/signup');
        }
        _.merge(req.flash, {
            email: registration.admin.email,
            code: registration.id
        });
        res.redirect('/registrations/success');
    });
};

exports.activate = function (req, res, next) {
    Registration.findByIdAndRemove(req.params.code, function (err, reg) {
        if (err) return next(err);
        if (!reg) return next(new Error('没有找到激活码'));
        reg.activate(function (err, user) {
            if (err) return next(err);
            req.login(user, function (err) {
                if (err) return next(err);
                res.redirect('/home');
            });
        });
    });
};

