'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validator = require('validator'),
    _ = require('lodash');

var registrationSchema = new Schema({
    companyName: {
        type: String,
        required: true
    },
    admin: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            validate: [validator.isEmail, 'Email格式错误']
        },
        password: {
            type: String,
            required: true,
            validate: [_.partialRight(validator.isLength, 6), '密码长度应大于6位']
        }}
});


module.exports = mongoose.model('Registration', registrationSchema);