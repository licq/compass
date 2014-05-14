"use strict";

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Resume = mongoose.model('Resume'),
  logger = require('../config/winston').logger();

var eventSchema = mongoose.Schema({
  startTime: {
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
  if (model.application) {
    Resume.findById(model.application).select('name email mobile applyPosition company status')
      .exec(function (err, resume) {
        if (!err) {
          model.name = resume.name;
          model.email = resume.email;
          model.mobile = resume.mobile;
          model.applyPosition = resume.applyPosition;
          model.company = resume.company;

          resume.status = 'interview';
          resume.saveAndIndexSync(function (err) {
            if (err) {
              logger.error('change status of ', resume.name, 'failed because of ', err);
              next(err);
            } else {
              next();
            }
          });
        }
      });
  } else {
    next();
  }
});

mongoose.model('Event', eventSchema);