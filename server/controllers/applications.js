"use strict";

var mongoose = require('mongoose'),
    Resume = mongoose.model('Resume');

exports.list = function (req, res, next) {
    req.query.company = req.user.company;
    Resume.query(req.query, function(err,results){
        if(err) return next(err);
        return res.json(results);
    });
};
