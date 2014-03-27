'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('lodash');

exports.list = function (req, res, next) {
    User.find({company: req.user.company})
        .exec(function (err, users) {
            if (err) return next(err);
            return res.json(users);
        });
};

exports.create = function (req, res) {
    var user = new User(req.body);
    user.company = req.user.company;
    user.createdBy = req.user._id;

    user.save(function (err) {
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
    req.user.remove(function (err) {
        if (err) return next(err);
        jobs.removeFetchUserJob(req.user);
        res.end();
    });
};

exports.get = function (req, res) {
    res.json(req.user);
};

exports.update = function (req, res, next) {
    _.merge(req.user, req.body);
    req.user.save(function (err) {
        if (err) return next(err);
        jobs.removeFetchUserJob(req.user, function () {
            jobs.addFetchUserJob(req.user);
        });
        res.end();
    });
};

exports.load = function (req, res, next, id) {
    User.findOne({_id: id, company: req.user.company})
        .exec(function (err, user) {
            if (err) return next(err);
            if (!user) return res.send(404, {message: 'not found'});
            req.user = user;
            next();
        });
};