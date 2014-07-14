'use strict';

var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  validator = require('validator'),
  merge = require('mongoose-merge-plugin');
var positionSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, '职位名不能为空']
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  department: String,
  evaluationCriterions: [{name: String, rate: Number}],
  owners: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  }
});

positionSchema.index({company: 1, name: 1}, {unique: true});

positionSchema.plugin(timestamps);
positionSchema.plugin(merge);

mongoose.model('Position', positionSchema);