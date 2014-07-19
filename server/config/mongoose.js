'use strict';

var mongoose = require('mongoose'),
  logger = require('./winston').logger(),
  merge = require('mongoose-merge-plugin');

module.exports = function (config) {
  mongoose.plugin(merge);
  mongoose.connect(config.db);
  var db = mongoose.connection;
//  mongoose.set('debug', true);

  db.on('error', console.error.bind(console, 'connection error...'));

  db.once('open', function () {
    logger.info('compass db connected');
  });

  require('../models/company');
  require('../models/applicationSetting');
  require('../models/role');
  require('../models/position');
  require('../models/user');
  require('../models/email');
  require('../models/mail');
  require('../models/eventSetting');
  require('../models/signup');
  require('../models/token');
  require('../models/resume');
  require('../models/interview');
  require('../models/evaluationCriterion');
  require('../models/applierRejectReason');
};
