"use strict";

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Resume = mongoose.model('Resume'),
  moment = require('moment'),
  logger = require('../config/winston').logger(),
  kue = require('kue'),
  _ = require('lodash'),
  jobs = kue.createQueue();

function interviewersValidator(interviewers) {
  return !!interviewers && interviewers.length > 0;
}
var eventSchema = {
  startTime: {
    type: Date,
    required: [true, '邀请时间不能为空'],
    index: true
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
    ],
    validate: [interviewersValidator, '至少一个面试人员'],
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
};

var interviewSchema = mongoose.Schema({
  events: [eventSchema ],
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: String,
  email: String,
  mobile: String,
  applyPosition: String
});

interviewSchema.index({company: 1, application: 1}, {unique: true});

function createSendEmailJob(emails) {
  emails.forEach(function (email) {
    email.title = 'send Event Alert Email to ' + email.to;
    jobs.create('send email', email).save();
  });
}

function createEmailContext(interview, event) {
  return {
    name: interview.name,
    email: interview.email,
    applyPosition: interview.applyPosition,
    startTime: event.startTime,
    endTime: moment(event.startTime).add('minutes', event.duration).toDate(),
    company: interview.company,
    application: interview.application,
    interviewers: event.interviewers
  };
}

interviewSchema.statics.addEvent = function (event, cb) {
  var Model = this;
  this.findOne({company: event.company, application: event.application})
    .exec(function (err, interview) {
      if (err) return cb(err);
      if (!interview) {
        interview = new Model({
          company: event.company,
          application: event.application,
          name: event.name,
          email: event.email,
          mobile: event.mobile,
          applyPosition: event.applyPosition
        });
      }
      interview.events.push(
        {
          duration: event.duration,
          startTime: event.startTime,
          interviewers: event.interviewers,
          createdBy: event.createdBy
        }
      );
      interview.save(function (err) {
        if (err) return cb(err);
        Resume.findById(interview.application).select('status')
          .exec(function (err, resume) {
            if (err) return cb(err);
            resume.status = 'interview';
            resume.saveAndIndexSync(function (err) {
              if (err) return cb(err);
              mongoose.model('EventSetting').generateEmails('new', event, function (err, emails) {
                if (!err)
                  createSendEmailJob(emails);
                cb(err, interview);
              });
            });
          });
      });
    });
};

interviewSchema.statics.eventsForInterviewer = function (interviewer, start, end, cb) {
  var match = {
    $match: {
      events: {
        $elemMatch: {
          startTime: {
            $gte: start,
            $lt: end
          },
        }
      }
    }};
  if (!!interviewer) {
    if (typeof interviewer === 'string') {
      interviewer = mongoose.Types.ObjectId(interviewer);
    }
    match.$match.events.$elemMatch.$or = [
      {
        interviewers: interviewer
      },
      {
        createdBy: interviewer
      }
    ];
  }

  this.aggregate(match)
    .unwind('events')
    .project({
      _id: '$events._id',
      interview_id: '$_id',
      name: 1,
      email: 1,
      applyPosition: 1,
      mobile: 1,
      company: 1,
      createdBy: '$events.createdBy',
      startTime: '$events.startTime',
      duration: '$events.duration',
      interviewers: '$events.interviewers',
      application: 1
    })
    .match({
      $or: [
        {
          interviewers: interviewer
        },
        {
          createdBy: interviewer
        }
      ],
      startTime: {
        $gte: start,
        $lt: end
      }
    })
    .exec(cb);
};

interviewSchema.statics.updateEvent = function (id, data, cb) {
  this.findOne({'events._id': id}).exec(function (err, interview) {
    if (err) return cb(err);
    if (!interview) return cb('interview not found for event with id ' + id);
    var event = interview.events.id(id);
    _.merge(event, data);
    interview.save(function (err) {
      if (err) return cb(err);
      mongoose.model('EventSetting').generateEmails('edit', createEmailContext(interview, event), function (err, emails) {
        if (!err)
          createSendEmailJob(emails);
        cb(err, interview);
      });
    });
  });
};

interviewSchema.statics.deleteEvent = function (id, cb) {
  this.findOne({'events._id': id}).exec(function (err, interview) {
    if (err) return cb(err);
    if (!interview) return cb('interview not found for event with id ' + id);
    var event = interview.events.id(id);
    event.remove();
    interview.save(function (err) {
      if (err) return cb(err);
      mongoose.model('EventSetting').generateEmails('delete', createEmailContext(interview, event), function (err, emails) {
        if (!err) {
          createSendEmailJob(emails);
        }
        cb(err, interview);
      });
    });
  });
};

mongoose.model('Interview', interviewSchema);