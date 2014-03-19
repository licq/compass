'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../');

var emailOptions = {
    host: "smtp.126.com",
    port: 25,
    auth: {
        user: "compass_test@126.com",
        pass: "compass123"
    }
};

var emailFrom = emailOptions.auth.user;

module.exports = {
    development: {
        rootPath: rootPath,
        port: process.env.PORT || 3000,
        db: 'mongodb://localhost/compass-dev',
        hostname: 'localhost',
        emailFrom: emailFrom,
        emailOptions: emailOptions,
    },
    test: {
        rootPath: rootPath,
        port: process.env.PORT || 3001,
        db: 'mongodb://localhost/compass-test',
        hostname: 'localhost',
        emailFrom: emailFrom,
        emailOptions: emailOptions,
    },
    production: {
        rootPath: rootPath,
        port: process.env.PORT || 80,
        db: 'mongodb://localhost/compass'
    }
};

