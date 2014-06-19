'use strict';

var mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  User = mongoose.model('User'),
  Role = mongoose.model('Role'),
  logger = require('./winston').logger();

module.exports.init = function () {

  Role.findOne({name: '系统管理员'}, function (err, role) {
    if (role === null) {
      Company.create({name: 'Compass'}, function (err, company) {
        if (err) {
          logger.error('failed to create company Compass');
        }
        else {
          Role.create({name: '系统管理员', company: company._id, permissions: ['#systemSettings']},
            function (err, role) {
              if (err) {
                logger.error('failed to create role: 系统管理员');
              }
              else {
                User.create({
                  name: 'systemadmin',
                  email: 'sysadmin@compass.com',
                  password: 'compass.123',
                  company: company._id,
                  role: role._id
                }, function (err, user) {
                  if (err) logger.error('failed to create user: systemadmin');
                });
              }
            });
        }
      });
    }
  });
};