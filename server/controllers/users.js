'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('lodash');

exports.list = function (req, res, next) {
    var query = User.find({
        company: req.user.company,
        deleted: false
    });

    if (req.query.fields) {
        var fields = req.query.fields;
        if (!Array.isArray(fields)) {
            fields = [fields];
        }
        query.select(fields.join(','));
    }
    query.exec(function (err, users) {
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

exports.delete = function (req, res, next) {
    req.loadedUser.deleted = true;
    req.loadedUser.save(function (err) {
        if (err) return next(err);
        res.end();
    });
};

exports.get = function (req, res) {
    res.json(req.loadedUser);
};

exports.update = function (req, res, next) {
    _.merge(req.loadedUser, req.body);
    req.loadedUser.save(function (err) {
        if (err) return next(err);
        res.end();
    });
};

exports.load = function (req, res, next, id) {
    User.findOne({_id: id, company: req.user.company})
        .select('name email title')
        .exec(function (err, loadedUser) {
            if (err) return next(err);
            if (!loadedUser) return res.send(404, {message: 'not found'});
            req.loadedUser = loadedUser;
            next();
        });
};