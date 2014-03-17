'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Company = mongoose.model('Company'),
    User = mongoose.model('User'),
    validator = require('validator'),
    _ = require('lodash');

var signupSchema = new Schema({
    companyName: {
        type: String,
        trim: true,
        required: [true, '请输入公司名称']
    },
    admin: {
        name: {
            type: String,
            trim: true,
            required: [true, '请输入管理员姓名']
        },
        email: {
            type: String,
            trim: true,
            required: [true, '请输入管理员Email'],
            validate: [validator.isEmail, 'Email格式错误']
        },
        password: {
            type: String,
            required: [true, '请输入管理员密码'],
            validate: [_.partialRight(validator.isLength, 6), '密码长度应大于6位']
        }
    }
});

signupSchema.path('companyName').validate(function (companyName, respond) {
    Company.findOne({name: companyName}, function (err, company) {
        respond(!err && !company);
    });
}, '该公司已注册');

signupSchema.path('admin.email').validate(function (email, respond) {
    User.findOne({email: email}, function (err, user) {
        respond(!err && !user);
    });
}, '该邮箱已注册');

signupSchema.methods.activate = function (done) {
    var self = this;
    Company.create({name: self.companyName}, function (err, company) {
        if (err) return done(err);
        User.create({
            name: self.admin.name,
            email: self.admin.email,
            password: self.admin.password,
            company: company.id
        }, function (err, user) {
            if (err) return done(err);
            done(null, user);
        });
    });
};


mongoose.model('Signup', signupSchema);