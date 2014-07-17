'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamp'),
  validator = require('validator');

var applicationSettingSchema = new Schema({
  positionRightControlled: {
    type: Boolean
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    unique: true
  }
});

applicationSettingSchema.plugin(timestamps);

mongoose.model('ApplicationSetting', applicationSettingSchema);