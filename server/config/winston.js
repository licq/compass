var winston = require('winston');

var logger;

exports.init = function (config) {
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({level: 'info'}),
            new (winston.transports.File)({filename: config.logFileName, level: 'error'})
        ]
    });
};

exports.logger = function () {
    return logger;
};
