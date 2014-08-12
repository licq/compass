'use strict';

var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  helper = require('../utilities/helper'),
  _ = require('lodash'),
  icalendar = require('icalendar');

var eventSettingSchema = mongoose.Schema({
  duration: {
    type: Number,
    required: [true, '默认时长不能为空'],
    default: 90
  },
  newToApplier: {
    type: Boolean,
    default: false
  },
  newTemplateToApplier: {
    type: String,
    default: '<h4><span>尊敬的{{姓名}}，　<br/></span><span>    您好，我司已为您安排好{{应聘职位}}的面试，请您带一份个人简历，准时参加面试。如不能前来，请提前电话通知我们。<br/></span>　面试时间： {{开始时间}} 至 {{结束时间}}<br/>　面试地点：<br/><span>　乘车路线：<br/></span>　联系电话：</h4>'
  },
  editToApplier: {
    type: Boolean,
    default: false
  },
  editTemplateToApplier: {
    type: String,
    default: '<h4>尊敬的{{姓名}}，　<br/>    您好,我司已为您重新安排好{{应聘职位}}的面试，请您带一份个人简历，准时参加面试。如不能前来，请提前电话通知我们。<br/>　面试时间： {{开始时间}} 至 {{结束时间}}<br/>　面试地点：<br/>　乘车路线：<br/>　联系电话：</h4>'
  },
  deleteToApplier: {
    type: Boolean,
    default: false
  },
  deleteTemplateToApplier: {
    type: String,
    default: '<h4>尊敬的{{姓名}}，　<br/>    您好，我司很抱歉的通知您，原先为您安排好于 {{开始时间}} 至 {{结束时间}}进行的{{应聘职位}}面试,因故取消，新的面试时间请等待另行通知。<br/>　</h4><h4>　联系电话：</h4><p><br/></p>'
  },
  newToInterviewer: {
    type: Boolean,
    default: false
  },
  newTemplateToInterviewer: {
    type: String,
    default: '<h4>    您好，为{{姓名}}安排的{{应聘职位}}面试，将于{{开始时间}} 至 {{结束时间}}进行，请准时参加面试。<br/>　</h4><h4>　联系电话：</h4>'
  },
  editToInterviewer: {
    type: Boolean,
    default: false
  },
  editTemplateToInterviewer: {
    type: String,
    default: '<h4>    您好，为{{姓名}}安排的{{应聘职位}}面试时间变更为{{开始时间}} 至 {{结束时间}}进行，请准时参加面试。<br/>　</h4><h4>　联系电话：</h4>'
  },
  deleteToInterviewer: {
    type: Boolean,
    default: false
  },
  deleteTemplateToInterviewer: {
    type: String,
    default: '<h4>    您好，很抱歉的通知您，原先为{{姓名}}安排好于 {{开始时间}} 至 {{结束时间}}进行的{{应聘职位}}面试,因故取消，新的面试时间请等待另行通知。<br/>　<br/>　联系电话：</h4><p><br/></p>'
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    unique: true
  }
});

eventSettingSchema.plugin(timestamps);

eventSettingSchema.methods.generateEmails = function (status, event, cb) {
  var model = this,
    emails = [],
    vEvent = new icalendar.VEvent(event.id),
    vCalendar = new icalendar.iCalendar();

  var statusForSubject = {new: '', edit: '变更', delete: '取消'};
  vEvent.setSummary(event.name + '面试提醒');
  vEvent.setDate(event.startTime, event.endTime);
  vEvent.addProperty('ORGANIZER', 'service@lingpin.cc');

  if (status === 'delete') {
    vEvent.addProperty('STATUS', 'CANCELLED');
    vEvent.addProperty('SEQUENCE', event.version + 1);
    vEvent.addProperty('METHOD', 'CANCEL');
    vCalendar.addProperty('METHOD', 'CANCEL');
  } else {
    vCalendar.addProperty('METHOD', 'REQUEST');
    vEvent.addProperty('SEQUENCE', event.version);
  }
  vCalendar.addComponent(vEvent);
  if (model[status + 'ToApplier']) {
    emails.push({
      subject: '面试' + statusForSubject[status] + '提醒',
      to: [event.email],
      html: helper.render(model[status + 'TemplateToApplier'], event),
      attachments: [
        {
          contentType: 'text/calendar',
          contents: vCalendar.toString(),
          contentEncoding: 'utf8'
        }
      ]
    });
  }

  if (model[status + 'ToInterviewer']) {
    mongoose.model('User').where('_id').in(event.interviewers).select('email')
      .exec(function (err, users) {
        if (err) return cb(err);
        var interviewerEmails = _.map(users, 'email');
        emails.push({
          subject: event.name + '面试' + statusForSubject[status] + '提醒',
          to: interviewerEmails,
          html: helper.render(model[status + 'TemplateToInterviewer'], event),
          attachments: [
            {
              contentType: 'text/calendar',
              contents: vCalendar.toString(),
              contentEncoding: 'utf8'
            }
          ]
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