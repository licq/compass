'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validator = require('validator');

var companySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    emails: [
        {
            address: {
                type: String,
                required: [true, '请输入邮箱地址'],
                validate: [validator.isEmail, 'Email格式错误']
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
            secure: {
                type: Boolean,
                default: false
            },
            ssl: {
                type: Boolean,
                default: false
            }
        }
    ]
});


module.exports = mongoose.model('Company', companySchema);