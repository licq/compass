'use strict';

var mongoose = require('mongoose'),
    Mail = mongoose.model('Mail'),
    _ = require('lodash');

exports.list = function (req, res, next) {
    Mail.find({company: req.user.company})
        .exec(function (err, mails) {
            if (err) return next(err);
            return res.json(mails);
        });
};
