var Factory = require('factory-lady'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    Signup = mongoose.model('Signup'),
    Email = mongoose.model('Email');

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
    company: Factory.assoc('company', 'id')
});

var emailAddressCounter = 1;
Factory.define('email', Email, {
    address: function (cb) {
        cb('resume' + emailAddressCounter++ + '@resume.com');
    },
    account: 'account',
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

module.exports = Factory;

