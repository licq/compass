'use strict';

var path = require('path'),
    _ = require('lodash');

var rootPath = path.normalize(__dirname + '/../../');

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
    templatePath: rootPath + 'server/templates/'
};


module.exports = {
    development: _.defaults({
        port: process.env.PORT || 3000,
        db: 'mongodb://localhost/compass-dev',
    }, defaultConfig),
    test: _.defaults({
        port: process.env.PORT || 3001,
        db: 'mongodb://localhost/compass-test',
    }, defaultConfig),
    production: _.defaults({
        port: process.env.PORT || 80,
        db: 'mongodb://localhost/compass'
    }, defaultConfig)
};

