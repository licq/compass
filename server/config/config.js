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

  templatePath: rootPath + 'server/templates/',
  logFileName: process.env.LOG_FILE ||'compass.log',
  elastic_host: process.env.ELASTICSEARCH_PORT_9200_TCP_ADDR || 'localhost',
  elastic_port: process.env.ELASTICSEARCH_PORT_9200_TCP_PORT || 9200,
  siteName: '领聘网'
};

var configs = {
  development: _.defaults({
    hostname: 'localhost',
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/compass-dev',
    elastic_index: 'compass-dev',
  }, defaultConfig),
  test: _.defaults({
    hostname: 'localhost',
    port: process.env.PORT || 3001,
    db: 'mongodb://localhost/compass-test',
    logFileName: 'compass-test.log',
    elastic_index: 'compass-test',
    emailOptions: {
      host: "smtp.1269.com",
      port: 25,
      auth: {
        user: "compass_test@126.com",
        pass: "compass123"
      }
    },
    redis_prefix: 'test'
  }, defaultConfig),
  production: _.defaults({
    hostname: 'www.lingpin.cc',
    port: process.env.PORT || 8080,
    db: 'mongodb://' + process.env.MONGODB_PORT_27017_TCP_ADDR + ':' + process.env.MONGODB_PORT_27017_TCP_PORT + '/compass',
    elastic_index: 'compass',
    redis_host: process.env.REDIS_PORT_6379_TCP_ADDR || 'localhost',
    redis_port: process.env.REDIS_PORT_6379_TCP_PORT || 6379
  }, defaultConfig)
};

module.exports = configs[env];
