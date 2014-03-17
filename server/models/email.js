'use strict';

var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamps'),
    validator = require('validator');

var emailSchema = mongoose.Schema({
    address: {
        type: String,
        required: [true, '请输入邮箱地址'],
        validate: [validator.isEmail, 'Email格式错误'],
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
    secure: {
        type: Boolean,
        default: false
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
    }
});

emailSchema.plugin(timestamps);


mongoose.model('Email', emailSchema);

