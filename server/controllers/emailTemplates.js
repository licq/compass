"use strict";

var mongoose = require('mongoose'),
    EmailTemplate = mongoose.model('EmailTemplate'),
    _ = require('lodash');

exports.list = function (req, res, next) {
    EmailTemplate.find({company: req.user.company})
        .exec(function (err, templates) {
            if (err) return next(err);
            res.json(templates);
        });
};

exports.create = function (req, res) {
    EmailTemplate.create({
        name: req.body.name,
        content: req.body.content,
        subject: req.body.subject,
        createdBy: req.user,
        company: req.user.company
    }, function (err) {
        if (err) {
            if (err.code === 11000 || err.code === 11001) {
                return res.json(400, {message: '名称已经存在'});
            } else {
                return res.json(400, err);
            }
        }
        res.send(200);
    });
};

exports.get = function (req, res) {
    res.json(req.emailTemplate);
};

exports.update = function (req, res) {
    _.merge(req.emailTemplate, req.body);
    console.log('enter here');
    req.emailTemplate.save(function (err) {
        if (err) {
            if (err.code === 11000 || err.code === 11001) {
                return res.json(400, {message: '名称已经存在'});
            } else {
                return res.json(400, err);
            }
        }
        res.send(200);
    });
};

exports.delete = function (req, res, next) {
    req.emailTemplate.remove(function (err) {
        if (err) return next(err);
        res.send(200);
    });
};

exports.load = function (req, res, next, id) {
    EmailTemplate.findOne({_id: id, company: req.user.company})
        .exec(function (err, emailTemplate) {
            if (err) return next(err);
            if (!emailTemplate) return res.send(404, {message: 'not found'});
            req.emailTemplate = emailTemplate;
            next();
        });
};