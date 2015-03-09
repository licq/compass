'use strict';

var _ = require('lodash'),
  logger = require('../config/winston').logger();

var parsers = [
  require('./job51Parser'),
  require('./zhaopinParser'),
  require('./liepinParser'),
  require('./dongfangParser'),
  require('./hr61Parser'),
  require('./ganjiParser')
];

exports.parse = function (data) {
  var parser = _.find(parsers, function (parser) {
    return parser.test(data);
  });

  if (parser) {
    return parser.parse(data);
  }
  else {
    throw new Error('not suitable parser for email from ' + data.fromAddress);
  }
};
