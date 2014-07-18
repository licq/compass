'use strict';

var Factory = require('factory-lady'),
  mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  Role = mongoose.model('Role'),
  User = mongoose.model('User'),
  Signup = mongoose.model('Signup'),
  ApplicationSetting = mongoose.model('ApplicationSetting'),
  Token = mongoose.model('Token'),
  Email = mongoose.model('Email'),
  Mail = mongoose.model('Mail'),
  EventSetting = mongoose.model('EventSetting'),
  Resume = mongoose.model('Resume'),
  Position = mongoose.model('Position');

var companyCounter = 1;

Factory.define('company', Company, {
  name: function (cb) {
    cb('company' + companyCounter++);
  }
});
var roleCounter = 1;

Factory.define('role', Role, {
  name: function (cb) {
    cb('role' + roleCounter++);
  },
  permissions: ['testpermission'],
  company: Factory.assoc('company', 'id')
});

var settingCounter = 1;

Factory.define('applicationSetting', ApplicationSetting, {
  name: function (cb) {
    cb('applicationSetting' + settingCounter++);
  },
  positionRightControlled : false,
  company: Factory.assoc('company', 'id')
});

var userCounter = 1;
var userEmailCounter = 1;

Factory.define('user', User, {
  name: function (cb) {
    cb('user' + userCounter++);
  },
  email: function (cb) {
    cb('email' + userEmailCounter++ + '@test.com');
  },
  password: 'password',
  title: 'title',
  company: Factory.assoc('company', 'id'),
  role: Factory.assoc('role', 'id')
});

Factory.define('token', Token, {
  user: Factory.assoc('user', 'id')
});

var emailAddressCounter = 1;
Factory.define('email', Email, {
  address: function (cb) {
    cb('resume' + emailAddressCounter++ + '@resume.com');
  },
  account: 'emailaccountforverifypass',
  password: 'password',
  server: 'lingpin.cc',
  company: Factory.assoc('company', 'id')
});


var signupCompanyNameCounter = 1;
var signupAdminEmailCounter = 1;
Factory.define('signup', Signup, {
  companyName: function (cb) {
    cb('companyName' + signupCompanyNameCounter++);
  },
  adminEmail: function (cb) {
    cb('adminEmail' + signupAdminEmailCounter++ + '@test.com');
  },
  adminName: 'admin',
  adminPassword: 'password'
});

Factory.define('mail', Mail, {
  from: [
    {address: 'aa@aa.com', name: 'aa'}
  ],
  to: [
    {address: 'bb@bb.com', name: 'bb'}
  ],
  subject: 'hello,this is from compass',
  html: '<h1>hello</h1>',
  date: '2012-03-15',
  mailbox: 'bb@bb.com'
});

Factory.define('eventSetting', EventSetting, {
  duration: 90,
  company: Factory.assoc('company', 'id'),
  createdBy: Factory.assoc('user', 'id')
});

var resumeCounter = 1;
Factory.define('resume', Resume, {
  name: function (cb) {
    cb('name' + resumeCounter++);
  },
  birthday: Date.now(),
  applyPosition: 'cio',
  educationHistory: {
    degree: 'master'
  },
  email: function (cb) {
    cb('email' + resumeCounter++ + '@test.com');
  },
  mobile: '18383838338',
  workExperience: [
    {
      from: new Date(),
      to: new Date(),
      company: '阿里巴巴'
    }
  ],
  company: Factory.assoc('company', 'id'),
  mail: Factory.assoc('mail', 'id')
});

Factory.define('interview', mongoose.model('Interview'), {
  application: Factory.assoc('resume', 'id'),
  company: Factory.assoc('company', 'id'),
  events: [
    {
      startTime: new Date(),
      duration: 90,
      interviewers: [],
      createdBy: Factory.assoc('user', 'id')
    }
  ],
  reviews: []
});

var positionCounter = 1;
Factory.define('position', Position, {
  name: function (cb) {
    cb('position' + positionCounter++);
  },
  company: Factory.assoc('company', 'id'),
  evaluationCriterions: [
    {
      'name': '主动性',
      'rate': 0.5
    },
    {
      'name': '英语',
      'rate': 0.7
    }
  ]
});

var applierRejectReasonCounter = 1;

Factory.define('applierRejectReason', mongoose.model('ApplierRejectReason'), {
  reason: 'reason' + applierRejectReasonCounter++
});

module.exports = Factory;
