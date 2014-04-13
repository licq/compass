"use strict";

var mongoose = require('mongoose'),
    EmailTemplate = mongoose.model('EmailTemplate');

exports.list = function (req, res, next) {
    EmailTemplate.find({company: req.user.company})
        .exec(function (err, templates) {
            if (err) return next(err);
            res.json(templates);
        });
};

exports.create = function (req, res, next) {
    EmailTemplate.create({
        name: req.body.name,
        content: req.body.content,
        subject: req.body.subject,
        createdBy: req.user,
        company: req.user.company
    }, function (err, emailTemplate) {
        if (err) {
            if (err.code === 11000 || err.code = 11001) {
                return res.json(400, {message: '名称已经存在'});
            } else {
                return res.json(400, err);
            }
        }
        res.send(200);
    });
};