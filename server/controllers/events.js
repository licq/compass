"use strict";

var mongoose = require('mongoose'),
    Event = mongoose.model('Event');

exports.create = function (req, res) {
    req.body.createdBy = req.user;
    req.body.createdByUserName = req.user.name;
    Event.create(req.body, function (err) {
        if (err) {
            res.send(400, {err: err});
        } else {
            res.send(200);
        }
    });
};
