'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../'),
    secret = 'CompassIsTheBest',
    sessionCollection = 'sessions';

module.exports = {
    development: {
        rootPath: rootPath,
        port: process.env.PORT || 3000,
        db: 'mongodb://localhost/compass-dev',
        sessionSecret: secret,
        sessionCollection: sessionCollection,
        log: 'dev'
    },
    test: {
        rootPath: rootPath,
        port: process.env.PORT || 3001,
        db: 'mongodb://localhost/compass-test',
        sessionSecret: secret,
        sessionCollection: sessionCollection,
        log: 'dev'
    },
    production: {
        rootPath: rootPath,
        port: process.env.PORT || 80,
        db: 'mongodb://localhost/compass',
        sessionSecret: secret,
        sessionCollection: sessionCollection,
        log: 'dev'
    }
};

