var winston = require('winston');

var logger;

exports.init = function (config) {
    exports.transports = [
        new (winston.transports.Console)({
            level: 'info',
            handleExceptions: true
        }),
        new (winston.transports.File)({
            filename: config.logFileName,
            level: 'error',
            handleExceptions: true
        })
    ];
};

exports.logger = function () {
    return logger || (logger = new (winston.Logger)({transports: exports.transports}));
};
