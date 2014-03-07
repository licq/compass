'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Company = require('./company'),
    User = require('./user'),
    validator = require('validator'),
    _ = require('lodash');

var registrationSchema = new Schema({
    companyName: {
        type: String,
        required: [true, '请输入公司名称']
    },
    admin: {
        name: {
            type: String,
            required: [true, '请输入管理员姓名']
        },
        email: {
            type: String,
            required: [true, '请输入管理员Email'],
            validate: [validator.isEmail, 'Email格式错误']
        },
        password: {
            type: String,
            required: [true, '请输入管理员密码'],
            validate: [_.partialRight(validator.isLength, 6), '密码长度应大于6位']
        }}
});

registrationSchema.methods.activate = function (done) {
    var self = this;
    new Company({name: self.companyName}).save(function (err, company) {
        if (err) return done(err);
        new User({
            name: self.admin.name,
            email: self.admin.email,
            password: self.admin.password,
            companyId: company.id
        }).save(function (err, user) {
                if (err) return done(err);
                done(null, user);
            });
    });
};


module.exports = mongoose.model('Registration', registrationSchema);