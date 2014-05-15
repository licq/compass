'use strict';

var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamps'),
  helper = require('../utilities/helper'),
  _ = require('lodash');

var eventSettingSchema = mongoose.Schema({
  duration: {
    type: Number,
    required: [true, '默认时长不能为空']
  },
  newToApplier: {
    type: Boolean,
    default: false
  },
  newTemplateToApplier: {
    type: String
  },
  editToApplier: {
    type: Boolean,
    default: false
  },
  editTemplateToApplier: {
    type: String
  },
  deleteToApplier: {
    type: Boolean,
    default: false
  },
  deleteTemplateToApplier: {
    type: String
  },
  newToInterviewer: {
    type: Boolean,
    default: false
  },
  newTemplateToInterviewer: {
    type: String
  },
  editToInterviewer: {
    type: Boolean,
    default: false
  },
  editTemplateToInterviewer: {
    type: String
  },
  deleteToInterviewer: {
    type: Boolean,
    default: false
  },
  deleteTemplateToInterviewer: {
    type: String
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    unique: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
});

eventSettingSchema.plugin(timestamps);

eventSettingSchema.methods.generateEmails = function (status, event, cb) {
  var model = this,
    emails = [];
  if (model[status + 'ToApplier']) {
    emails.push({
      subject: '面试提醒',
      to: [event.email],
      html: helper.render(model[status + 'TemplateToApplier'], event)
    });
  }

  if (model[status + 'ToInterviewer']) {
    mongoose.model('User').where('_id').in(event.interviewers).select('email')
      .exec(function (err, users) {
        if (err) return cb(err);
        emails.push({
          subject: '面试提醒',
          to: _.map(users, function (user) {
            return user.email;
          }),
          html: helper.render(model[status + 'TemplateToInterviewer'], event)
        });
        cb(null, emails);
      }
    );
  } else
    cb(null, emails);
};

eventSettingSchema.statics.generateEmails = function (status, event, cb) {
  this.findOne({company: event.company}).exec(function (err, eventSetting) {
    if (err) return cb(err);
    if (!eventSetting) return cb(null, []);
    eventSetting.generateEmails(status, event, cb);
  });
};

mongoose.model('EventSetting', eventSettingSchema);