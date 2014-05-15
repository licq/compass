"use strict";

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Resume = mongoose.model('Resume'),
  moment = require('moment'),
  logger = require('../config/winston').logger(),
  kue = require('kue'),
  jobs = kue.createQueue();

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

eventSchema.virtual('endTime').get(function () {
  return moment(this.startTime).add('minutes', this.duration).toDate();
});
eventSchema.path('interviewers').validate(function (interviewers) {
  return interviewers && interviewers.length > 0;
}, '至少一个面试人员');

eventSchema.pre('save', function (next) {
  var model = this;
  model.wasNew = model.isNew;
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

function createSendEmailJob(emails) {
  emails.forEach(function (email) {
    email.title = 'send Event Alert Email to ' + email.to;
    jobs.create('send email', email).save();
  });
}
eventSchema.post('save', function () {
  if (this.wasNew) {
    mongoose.model('EventSetting').generateEmails('new', this, function (err, emails) {
      if (err) logger.error('eventSetting generate Emails failed', err);
      createSendEmailJob(emails);
    });
  } else {
    mongoose.model('EventSetting').generateEmails('edit', this, function (err, emails) {
      if (err) logger.error('eventSetting generate Emails failed', err);
      createSendEmailJob(emails);
    });
  }
});

eventSchema.post('remove', function () {
  mongoose.model('EventSetting').generateEmails('delete', this, function (err, emails) {
    if (err) logger.error('eventSetting generate delete emails failed', err);
    createSendEmailJob(emails);
  });
});

mongoose.model('Event', eventSchema);