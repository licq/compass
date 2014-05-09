"use strict";

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Resume = mongoose.model('Resume');

var eventSchema = mongoose.Schema({
    time: {
        type: Date,
        required: [true, '邀请时间不能为空']
    },
    duration: {
        type: Number,
        required: [true, '时长不能为空']
    },
    interviewers: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
        required: true
    },
    sendEventAlert: {
        type: Boolean,
        default: false
    },
    emailTemplate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmailTemplate'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: String,
    email: String,
    mobile: String,
    applyPosition: String,
    interviewerNames: [String],
    createdByUserName: String,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }
});

eventSchema.path('interviewers').validate(function (interviewers) {
    return interviewers && interviewers.length > 0;
}, '至少一个面试人员');


eventSchema.path('sendEventAlert').validate(function (send) {
    return !send || !!this.emailTemplate;
}, '请选择邮件模板');

eventSchema.pre('save', function (next) {
    var model = this;
    if (model.createdBy) {
        User.findById(model.createdBy).select('name').exec(function (err, user) {
            if (err) return next();
            model.createdByUserName = user.name;
            return next();
        });
    } else {
        next();
    }
});

eventSchema.pre('save', function (next) {
    var model = this;
    if (model.interviewers) {
        User.find({_id: {$in: model.interviewers}})
            .select('name')
            .exec(function (err, names) {
                if (!err) {
                    model.interviewerNames = names.map(function (n) {
                        return n.name;
                    });
                }
                next();
            });
    } else {
        next();
    }
});

eventSchema.pre('save', function (next) {
    var model = this;
    if (model.application) {
        Resume.findById(model.application).select('name email mobile applyPosition company')
            .exec(function (err, app) {
                if (!err) {
                    model.name = app.name;
                    model.email = app.email;
                    model.mobile = app.mobile;
                    model.applyPosition = app.applyPosition;
                    model.company = app.company;
                }
                next();
            });
    } else {
        next();
    }
});

mongoose.model('Event', eventSchema);