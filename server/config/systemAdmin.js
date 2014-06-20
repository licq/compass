'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User');

exports.init = function () {
  User.createSystemAdmin();
};