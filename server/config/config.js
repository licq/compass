'use strict';

var path = require('path'),
  _ = require('lodash');

var rootPath = path.normalize(__dirname + '/../../');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var all = {
  rootPath: rootPath,
  templatePath: rootPath + 'server/templates/',
  siteName: '领聘网'
};

var configs = {
  development: {
    emailOptions: {
      host: "smtp.126.com",
      port: 25,
      auth: {
        user: "compass_test@126.com",
        pass: "compass123"
      },
      from: "compass_test@126.com",
    },
    hostname: 'localhost',
    port: process.env.PORT || 3000,
    logFileName: 'compass-dev.log',
    db: 'mongodb://localhost/compass-dev',
    elastic: {
      host: 'localhost',
      port: 9200,
      index: 'compass-dev'
    },
    redis: {
      host: 'localhost',
      port: 6379,
      prefix: 'compass-dev'
    }
  },
  test: {
    hostname: 'localhost',
    port: 3001,
    db: 'mongodb://localhost/compass-test',
    logFileName: 'compass-test.log',
    elastic: {
      host: 'localhost',
      port: 9200,
      index: 'compass-test'
    },
    emailOptions: {
      host: "smtp.1269.com",
      port: 25,
      auth: {
        user: "compass_test@126.com",
        pass: "compass123"
      },
      from: "compass_test@126.com"
    },
    redis: {
      host: 'localhost',
      port: 6379,
      prefix: 'compass-test'
    }
  },
  production: {
    hostname: 'www.lingpin.cc',
    port: process.env.PORT || 8080,
    logFileName: process.env.LOG_FILE || 'compass.log',
    db: 'mongodb://' + (process.env.MONGODB_PORT_27017_TCP_ADDR || 'localhost') + ':' + (process.env.MONGODB_PORT_27017_TCP_PORT || 27017) + '/compass',
    redis: {
      host: process.env.REDIS_PORT_6379_TCP_ADDR || 'localhost',
      port: process.env.REDIS_PORT_6379_TCP_PORT || 6379,
      prefix: 'compass'
    },
    elastic: {
      host: process.env.ELASTICSEARCH_PORT_9200_TCP_ADDR || 'localhost',
      port: process.env.ELASTICSEARCH_PORT_9200_TCP_PORT || 9200,
      index: 'compass'
    },
    emailOptions: {
      host: "smtp.exmail.qq.com",
      port: 465,
      auth: {
        user: "service@lingpin.cc",
        pass: "compass.123"
      },
      secureConnection: true,
      from: 'service@lingpin.cc'
    }
  }
};

module.exports = _.defaults(configs[env], all);
