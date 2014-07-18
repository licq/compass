'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamp'),
  validator = require('validator'),
  logger = require('../config/winston').logger();

var companySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

companySchema.plugin(timestamps);

mongoose.model('Company', companySchema);