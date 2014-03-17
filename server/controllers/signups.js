'use strict';

var mongoose = require('mongoose'),
    Signup = mongoose.model('Signup'),
    _ = require('lodash');


exports.create = function (req, res) {
    var signup = new Signup(req.body);

    signup.save(function (err, saved) {
        if (err) {
            return res.json(400, err);
        }
        res.json({_id: saved._id, email: saved.admin.email});
    });
};

exports.activate = function (req, res, next) {
    Signup.findByIdAndRemove(req.params.code, function (err, signup) {
        if (err) return next(err);
        if (!signup) return res.json(404, {err: '没有找到激活码'});
        signup.activate(function (err) {
            if (err) return res.json(400, err);
            res.end();
        });
    });
};

