'use strict';

var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  validator = require('validator'),
  merge = require('mongoose-merge-plugin');
var roleSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, '姓名不能为空']
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  permissions: [String]
});

roleSchema.index({company: 1, name: 1}, {unique: true});

roleSchema.path('name').validate(function (name) {
  return (typeof name === 'string' && name.length > 0);
}, '角色名不能为空');

roleSchema.plugin(timestamps);
roleSchema.plugin(merge);

mongoose.model('Role', roleSchema);