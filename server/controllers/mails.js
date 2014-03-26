'use strict';

var mongoose = require('mongoose'),
    Mail = mongoose.model('Mail'),
    _ = require('lodash');

exports.list = function (req, res, next) {
    var query = Mail.find({company: req.user.company})
        .sort('-date')
        .select('fromName fromAddress subject date mailbox');
    if (req.query.page && req.query.pageSize) {
        query.skip((req.query.page - 1) * req.query.pageSize).limit(req.query.pageSize);
    }
    query.exec(function (err, mails) {
        if (err) return next(err);
        Mail.count({company: req.user.company}, function (err, totalCount) {
            if (err) return next(err);
            return res.header('totalCount', totalCount).json(mails);
        });
    });
};

exports.get = function (req, res) {
    res.json(req.mail);
};

exports.load = function (req, res, next, id) {
    Mail.findOne({_id: id, company: req.user.company})
        .exec(function (err, mail) {
            if (err) return next(err);
            if (!mail) return res.send(404, {message: 'not found'});
            req.mail = mail;
            next();
        });
};
