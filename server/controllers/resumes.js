'use strict';

var mongoose = require('mongoose'),
    Resume = mongoose.model('Resume'),
    _ = require('lodash'),
    jobs = require('../tasks/jobs');

exports.list = function (req, res, next) {
    var query = Resume.find({company: req.user.company})
        .sort('-created_at');
    if (req.query.page && req.query.pageSize) {
        query.skip((req.query.page - 1) * req.query.pageSize).limit(req.query.pageSize);
    }
    query.exec(function (err, resumes) {
        if (err) return next(err);
        Resume.count({company: req.user.company}, function (err, totalCount) {
            if (err) return next(err);
            return res.header('totalCount', totalCount).json(resumes);
        });
    });
};