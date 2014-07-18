'use strict';

var mongoose = require('mongoose'),
  _ = require('lodash'),
  User = mongoose.model('User'),
  ApplierRejectReason = mongoose.model('ApplierRejectReason');

exports.init = function (cb) {
  var reasons = ['薪资福利不满意', '有更好的发展机会', '原公司挽留', '工作地点离家远', '想回老家发展', '继续深造', '无法按时入职', '失联', '其他'];

  ApplierRejectReason.count(function (err, count) {
    if (err) return cb(err);
    if (count === 0) {
      ApplierRejectReason.create(_.map(reasons, function (reason) {
        return {reason: reason};
      }));
    }
    User.createSystemAdmin(cb);
  });
};