"use strict";

var mongoose = require('mongoose'),
    Resume = mongoose.model('Resume');

exports.list = function (req, res, next) {
    req.query.company = req.user.company;
    req.query.sort = [
        {
            created_at: {order: 'desc'}
        }
    ];
    Resume.query(req.query, function (err, results) {
        if (err) return next(err);
        return res.json(results);
    });
};

exports.get = function (req, res) {
    res.json(req.resume);
};

exports.load = function (req, res, next, id) {
    Resume.findOne({_id: id})
        .exec(function (err, resume) {
            if (err) return next(err);
            if (!resume) return res.send(404, {message: 'not found'});
            req.resume = resume;
            next();
        });
};

