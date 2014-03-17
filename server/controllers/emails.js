'use strict';

var mongoose = require('mongoose'),
    Email = mongoose.model('Email');

exports.list = function (req, res, next) {
    Email.find({company: req.user.company}, function (err, emails) {
        if (err) return next(err);
        return res.json(emails);
    });
};

exports.create = function (req, res) {
    var email = new Email(req.body);
    email.company = req.user.company;
    email.save(function (err) {
        if (err) {
            if (err.code === 11000 || err.code === 11001) {
                return res.json(400, {message: '邮箱地址已经存在'});
            } else {
                return res.json(400, {message: err.message});
            }
        }
        res.end();
    });
};

exports.delete = function (req, res) {
    var id = req.params.id;
    Email.remove({_id: id}, function (err) {
        if (err) return res.json(400, err);
        res.end();
    });
}