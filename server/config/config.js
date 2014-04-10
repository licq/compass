'use strict';

var path = require('path'),
    _ = require('lodash');

var rootPath = path.normalize(__dirname + '/../../');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var defaultConfig = {
    emailOptions: {
        host: "smtp.126.com",
        port: 25,
        auth: {
            user: "compass_test@126.com",
            pass: "compass123"
        }
    },
    emailFrom: "compass_test@126.com",
    rootPath: rootPath,
    hostname: 'localhost',
    templatePath: rootPath + 'server/templates/',
    logFileName: 'compass.log'
};

var configs = {
    development: _.defaults({
        port: process.env.PORT || 3000,
        db: 'mongodb://localhost/compass-dev',
    }, defaultConfig),
    test: _.defaults({
        port: process.env.PORT || 3001,
        db: 'mongodb://localhost/compass-test',
        logFileName: 'compass-test.log'
    }, defaultConfig),
    production: _.defaults({
        port: process.env.PORT || 80,
        db: 'mongodb://localhost/compass'
    }, defaultConfig)
};

module.exports = configs[env];
