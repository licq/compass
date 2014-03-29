'use strict';

var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamps'),
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
    lastRetrieveTime: Date
});

emailSchema.methods.verify = function (callback) {
    emailChecker.check(this, function (err) {
        if (err) return callback({message: err});
        callback();
    });
};

emailSchema.statics.setActivity = function (activity, callback) {
    this.findOne({address: activity.address }).exec(function (err, email) {
        if (err) return callback(err);
        if (!email) return callback(new Error('could not find email ' + activity.address));
        email.lastRetrieveCount = activity.count;
        email.lastRetrieveTime = activity.time;
        email.lastError = activity.error;
        if (!activity.error) {
            email.totalRetrieveCount += activity.count;
        }
        email.save(function (err, saved) {
            if (err) return callback(err);
            callback(null, saved);
        });
    });
};

emailSchema.plugin(timestamps);


mongoose.model('Email', emailSchema);

