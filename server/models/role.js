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

roleSchema.methods.isSystemAdmin = function () {
  return this.name === '系统管理员' && this.permissions[0] === '#systemSettings';
};

roleSchema.statics.createRoleForSystemAdmin = function (company, cb) {
  var model = this;
  model.findOneAndUpdate({name: '系统管理员', company: company._id},
    {name: '系统管理员', company: company._id, permissions: ['#systemSettings']},
    {upsert: true}, function (err, role) {
      cb(err, role, company);
    });
};

mongoose.model('Role', roleSchema);