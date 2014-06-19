'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Company = mongoose.model('Company'),
  Role = mongoose.model('Role'),
  User = mongoose.model('User'),
  EventSetting = mongoose.model('EventSetting'),
  validator = require('validator'),
  uuid = require('node-uuid'),
  timestamps = require('mongoose-timestamp'),
  _ = require('lodash');

var signupSchema = new Schema({
  _id: {
    type: String,
    unique: true
  },
  companyName: {
    type: String,
    trim: true,
    required: [true, '请输入公司名称']
  },
  adminName: {
    type: String,
    trim: true,
    required: [true, '请输入管理员姓名']
  },
  adminEmail: {
    type: String,
    trim: true,
    required: [true, '请输入管理员Email'],
    validate: [validator.isEmail, 'Email格式错误']
  },
  adminPassword: {
    type: String,
    required: [true, '请输入管理员密码'],
    validate: [_.partialRight(validator.isLength, 6), '密码长度应大于6位']
  }

});

signupSchema.plugin(timestamps);

signupSchema.path('companyName').validate(function (companyName, respond) {
  Company.findOne({name: companyName}, function (err, company) {
    respond(!err && !company);
  });
}, '该公司已注册');

signupSchema.path('adminEmail').validate(function (email, respond) {
  User.findOne({email: email}, function (err, user) {
    respond(!err && !user);
  });
}, '该邮箱已注册');

signupSchema.pre('save', function (next) {
  if (this.isNew) {
    this._id = uuid.v1();
  }
  next();
});


signupSchema.methods.activate = function (done) {
  var self = this;
  Company.create({name: self.companyName}, function (err, company) {
    if (err) return done(err);
    Role.create({name: '管理员', company: company._id, permissions: ['*']},
      function (err, role) {
        if (err) return done(err);
        User.create({
          name: self.adminName,
          email: self.adminEmail,
          password: self.adminPassword,
          company: company._id,
          role: role._id
        }, function (err, user) {
          if (err) return done(err);
          EventSetting.create({company: company._id}, function (err) {
            if (err) return done(err);
            done(null, company, user);
          });
        });
      });
  });
};

mongoose.model('Signup', signupSchema);