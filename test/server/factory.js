'use strict';

var Factory = require('factory-lady'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    Signup = mongoose.model('Signup'),
    Email = mongoose.model('Email'),
    Mail = mongoose.model('Mail'),
    EmailTemplate = mongoose.model('EmailTemplate'),
    Resume = mongoose.model('Resume'),
    Event = mongoose.model('Event');

var companyCounter = 1;

Factory.define('company', Company, {
    name: function (cb) {
        cb('company' + companyCounter++);
    }
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
    company: Factory.assoc('company', 'id')
});

var emailAddressCounter = 1;
Factory.define('email', Email, {
    address: function (cb) {
        cb('resume' + emailAddressCounter++ + '@resume.com');
    },
    account: 'emailaccountforverifypass',
    password: 'password',
    server: 'server.com',
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

var emailTemplateCounter = 1;
Factory.define('emailTemplate', EmailTemplate, {
    name: function (cb) {
        cb('template' + emailTemplateCounter++);
    },
    content: 'hello,this is an email from compass',
    subject: 'hello',
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
    email: function(cb){
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
    company: Factory.assoc('company', 'id')
});

Factory.define('event', Event, {
    application: Factory.assoc('resume', 'id'),
    time: new Date(),
    interviewers: [],
    sendEventAlert: true,
    emailTemplate: Factory.assoc('emailTemplate', 'id'),
    createdBy: Factory.assoc('user','id')
});

module.exports = Factory;