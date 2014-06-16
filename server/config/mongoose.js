'use strict';

var mongoose = require('mongoose'),
  logger = require('./winston').logger();

module.exports = function (config) {
  mongoose.connect(config.db);
  var db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error...'));

  db.once('open', function () {
    logger.info('compass db connected');
  });

  require('../models/company');
  require('../models/role');
  require('../models/user');
  require('../models/email');
  require('../models/mail');
  require('../models/signup');
  require('../models/token');
  require('../models/resume');
  require('../models/eventSetting');
  require('../models/interview');
  require('../models/evaluationCriterion');
  require('../models/applierRejectReason');
};
