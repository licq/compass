'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamps'),
  validator = require('validator');

var companySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

companySchema.plugin(timestamps);

mongoose.model('Company', companySchema);