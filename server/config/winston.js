'use strict';

var moment = require('moment'),
  winston = require('winston');

var logger;

exports.init = function (config) {
  exports.transports = [
    new (winston.transports.Console)({
      level: 'debug',
      handleExceptions: true,
      colorize: true,
      timestamp: function () {
        return moment().format('YYYY/MM/DD HH:mm:ss:SSS');
      }
    }),
    new winston.transports.DailyRotateFile({
      filename: config.logFileName,
      timestamp: function () {
        return moment().format('YYYY/MM/DD HH:mm:ss:SSS');
      },
      level: 'info',
      handleExceptions: true
    })
  ];
};

exports.logger = function () {
  return logger || (logger = new (winston.Logger)({transports: exports.transports}));
};
