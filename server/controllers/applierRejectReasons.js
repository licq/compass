'use strict';

var ApplierRejectReason = require('mongoose').model('ApplierRejectReason'),
  _ = require('lodash');

exports.list = function (req, res, next) {
  ApplierRejectReason.find().exec(function (err, reasons) {
    if (err) return next(err);
    res.json(_.map(reasons, 'reason'));
  });
};