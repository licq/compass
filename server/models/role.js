'use strict';

var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  validator = require('validator'),
  merge = require('mongoose-merge-plugin');
var roleSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, '角色名不能为空']
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  permissions: [String]
});

roleSchema.index({company: 1, name: 1}, {unique: true});

roleSchema.plugin(timestamps);
roleSchema.plugin(merge);

mongoose.model('Role', roleSchema);