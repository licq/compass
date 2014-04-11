'use strict';

var winston = require('winston');

var logger;

exports.init = function (config) {
    exports.transports = [
        new (winston.transports.Console)({
            level: 'debug',
            handleExceptions: true,
            colorize: true,
            timestamp: true
        }),
        new (winston.transports.File)({
            filename: config.logFileName,
            level: 'info',
            handleExceptions: true,
            timestamp: true
        })
    ];
};

exports.logger = function () {
    return logger || (logger = new (winston.Logger)({transports: exports.transports}));
};
