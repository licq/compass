'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        rootPath: rootPath,
        port: process.env.PORT || 3000,
        db: 'mongodb://localhost/compass-dev',
    },
    test: {
        rootPath: rootPath,
        port: process.env.PORT || 3001,
        db: 'mongodb://localhost/compass-test',
    },
    production: {
        rootPath: rootPath,
        port: process.env.PORT || 80,
        db: 'mongodb://localhost/compass',
    }
};

