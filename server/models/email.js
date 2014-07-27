'use strict';

var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  validator = require('validator'),
  emailChecker = require('../tasks/emailChecker');

var emailSchema = mongoose.Schema({
  address: {
    type: String,
    required: [true, '请输入邮箱地址'],
    validate: [validator.isEmail, 'Email格式不正确'],
    unique: true
  },
  account: {
    type: String,
    required: [true, '请输入帐号']
  },
  password: {
    type: String,
    required: [true, '请输入邮箱密码']
  },
  server: {
    type: String,
    required: [true, '请输入POP3服务器地址']
  },
  port: {
    type: Number,
    default: 110,
    required: [true, '请输入端口号']
  },
  ssl: {
    type: Boolean,
    default: false
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  totalRetrieveCount: {
    type: Number,
    default: 0
  },
  lastRetrieveCount: {
    type: Number,
    default: 0
  },
  lastError: String,
  lastRetrieveTime: Date,
  keepMails : {
    type: Boolean,
    default: true
  },
  retrievedMails: [String]
});

emailSchema.methods.verify = function (callback) {
  emailChecker.check(this, function (err) {
    if (err) return callback({message: err});
    callback();
  });
};

emailSchema.plugin(timestamps);


mongoose.model('Email', emailSchema);

