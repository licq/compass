"use strict";

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Resume = mongoose.model('Resume'),
  moment = require('moment'),
  logger = require('../config/winston').logger(),
  _ = require('lodash'),
  jobs = require('../tasks/jobs'),
  timestamps = require('mongoose-timestamp');

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

var reviewSchema = mongoose.Schema({
  interviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  qualified: Boolean,
  comment: String,
  items: [
    {
      name: {
        type: String,
        required: true
      },
      rate: {
        type: Number,
        required: true
      },
      score: {
        type: Number,
        required: true
      }
    }
  ],
  totalScore: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

var interviewSchema = mongoose.Schema({
  events: [eventSchema ],
  reviews: [reviewSchema],
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
  applyPosition: String,
  status: {
    type: 'String',
    enum: ['new', 'offered', 'rejected', 'offer rejected', 'offer accepted'],
    default: 'new'
  },
  onboardDate: {
    type: Date
  },
  applierRejectReason: {
    type: String
  },
  statusBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAtLocaltime: {
    type: Date
  },
  updatedAtLocaltime: {
    type: Date
  }
});

interviewSchema.plugin(timestamps);
interviewSchema.index({company: 1, application: 1}, {unique: true});
interviewSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdAtLocaltime = moment(this.createdAt).add('hours', 8).toDate();
  }
  this.updatedAtLocaltime = moment(this.updatedAt).add('hours', 8).toDate();
  next();
});

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
                if (err) {
                  logger.error('create alert email failed ' + err);
                } else {
                  jobs.createSendEmailJob(emails);
                }
                cb(err, interview);
              });
            });
          });
      });
    });
};

interviewSchema.statics.eventsForInterviewer = function (interviewer, start, end, pageSize, cb) {
  interviewer = mongoose.Types.ObjectId(interviewer);

  var match = {
    $match: {
      status: 'new',
      events: {
        $elemMatch: {
          startTime: {
            $gte: start,
            $lt: end
          },
          interviewers: interviewer
        }
      }
    }};
  var query = this.aggregate(match)
    .project({
      name: 1,
      email: 1,
      applyPosition: 1,
      mobile: 1,
      company: 1,
      events: 1,
      application: 1,
      countOfEvents: {$size: '$events'}
    })
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
      application: 1,
      countOfEvents: 1
    })
    .match({ interviewers: interviewer, startTime: { $gte: start, $lt: end } })
    .sort('startTime');

  if (typeof pageSize === 'function') {
    cb = pageSize;
    return query.exec(cb);
  }

  if (pageSize) {
    query.limit(parseInt(pageSize));
  }

  return query.exec(cb);
};

interviewSchema.statics.eventsCountForInterviewer = function (interviewer, start, end, cb) {
  interviewer = mongoose.Types.ObjectId(interviewer);

  var match = {
    $match: {
      status: 'new',
      events: {
        $elemMatch: {
          startTime: {
            $gte: start,
            $lt: end
          },
          interviewers: interviewer
        }
      }
    }};
  var query = this.aggregate(match)
    .project({
      events: 1,
      company: 1
    })
    .unwind('events')
    .project({
      company: 1,
      _id: '$events._id',
      createdBy: '$events.createdBy',
      startTime: '$events.startTime',
      interviewers: '$events.interviewers'
    })
    .match({ interviewers: interviewer, startTime: { $gte: start, $lt: end } })
    .group({_id: '$company', total: {$sum: 1}});

  query.exec(cb);
};

interviewSchema.statics.eventsForCompany = function (company, start, end, cb) {
  var match = {
    $match: {
      'events.startTime': {
        $gte: start,
        $lt: end
      },
      company: mongoose.Types.ObjectId(company),
      status: 'new'
    }};

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
    .exec(cb);
};

interviewSchema.statics.updateEvent = function (id, data, cb) {
  this.findOne({'events._id': id}).exec(function (err, interview) {
    if (err) return cb(err);
    if (!interview) return cb('interview not found for event with id ' + id);
    var event = interview.events.id(id);
    event.startTime = data.startTime || event.startTime;
    event.duration = data.duration || event.startTime;
    event.interviewers = data.interviewers || event.interviewers;
    interview.save(function (err) {
      if (err) return cb(err);
      mongoose.model('EventSetting').generateEmails('edit', createEmailContext(interview, event), function (err, emails) {
        if (err) {
          logger.error('create alert email failed ' + err);
        } else {
          jobs.createSendEmailJob(emails);
        }
        cb(err, interview);
      });
    });
  });
};

function sendDeleteEventEmail(interview, event, cb) {
  mongoose.model('EventSetting').generateEmails('delete', createEmailContext(interview, event), function (err, emails) {
    if (err) {
      logger.error('create alert email failed ' + err);
    } else {
      jobs.createSendEmailJob(emails);
    }
    cb(null, interview);
  });
}
interviewSchema.statics.deleteEvent = function (id, cb) {
  this.findOne({'events._id': id}).exec(function (err, interview) {
    if (err) return cb(err);
    if (!interview) return cb('interview not found for event with id ' + id);
    var event = interview.events.id(id);
    event.remove();
    if (interview.events.length === 0) {
      interview.remove(function (err) {
        if (err) return cb(err);
        sendDeleteEventEmail(interview, event, function (err, interview) {
          mongoose.model('Resume').findOne({_id: interview.application}).exec(function (err, resume) {
            if (err) return cb(err);
            if (!resume) return cb();
            resume.status = 'pursued';
            resume.save(function (err) {
              if (err) return cb(err);
              return cb();
            });
          });
        });
      });
    } else {
      interview.save(function (err) {
        if (err) return cb(err);
        sendDeleteEventEmail(interview, event, cb);
      });
    }
  });
};

function constructQueryForReview(model, user, options) {
  var query;
  if (options.startDate) {
    options.startDate = options.startDate.replace(/"/g, '');
    var start = moment(options.startDate).startOf('day').toDate();
    var end = moment(options.startDate).endOf('day').toDate();
    query = model.where('events').elemMatch({startTime: {$lte: end, $gte: start}, interviewers: user._id});
  } else {
    query = model.where('events').elemMatch({startTime: {$lte: moment().endOf('day').toDate()}, interviewers: user._id});
  }
  if (options.name) {
    query.where('name').regex(new RegExp(options.name));
  }
  if (options.applyPosition) {
    query.where('applyPosition').regex(new RegExp(options.applyPosition));
  }

  return query;
}

interviewSchema.statics.queryForReview = function (user, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {
      page: 1,
      pageSize: 20
    };
  }

  var orderBy = options.orderBy ? options.orderBy.replace(/\[\d+\]/, '') : 'events.startTime';
  var orderByReverse = options.orderByReverse === 'true' ? -1 : 1;
  var sortOptions = {};
  sortOptions[orderBy] = orderByReverse;
  var query = constructQueryForReview(this, user, options);
  query.select({
    name: 1,
    applyPosition: 1,
    events: {$elemMatch: {
      'interviewers': user._id
    }},
    reviews: {$elemMatch: {
      'interviewer': user._id
    }}
  }).sort(sortOptions)
    .skip((options.page - 1) * options.pageSize)
    .limit(options.pageSize).exec(cb);
};

interviewSchema.statics.queryForUnreviewed = function (user, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {
      page: 1,
      pageSize: 20
    };
  }

  var orderBy = options.orderBy ? options.orderBy.replace(/\[\d+\]/, '') : 'events.startTime';
  var orderByReverse = options.orderByReverse === 'true' ? -1 : 1;
  var sortOptions = {};
  sortOptions[orderBy] = orderByReverse;
  var query = constructQueryForReview(this, user, options);
  query.where('reviews.interviewer').ne(user._id)
    .sort(sortOptions)
    .skip((options.page - 1) * options.pageSize)
    .limit(options.pageSize).exec(cb);
};

interviewSchema.statics.countForReview = function (user, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  var query = constructQueryForReview(this, user, options).count();
  return query.exec(cb);
};

interviewSchema.statics.countForUnreviewed = function (user, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  var query = constructQueryForReview(this, user, options)
    .where('reviews.interviewer').ne(user._id)
    .count();
  return query.exec(cb);
};

function constructQueryNew(model, company, options) {
  var query = model.find({company: company, status: 'new'}).where('events.startTime').lte(moment().endOf('day').toDate());
  if (options.name) {
    query.where('name').regex(new RegExp(options.name));
  }
  if (options.applyPosition) {
    query.where('applyPosition').regex(new RegExp(options.applyPosition));
  }
  if (options.startDate) {
    options.startDate = options.startDate.replace(/"/g, '');
    var start = moment(options.startDate).startOf('day').toDate();
    var end = moment(options.startDate).endOf('day').toDate();
    query.where('events.startTime').lte(end).gte(start);
  }
  return query;
}

interviewSchema.statics.queryNew = function (company, options, cb) {
  var orderBy = options.orderBy ? options.orderBy.replace(/\[\d+\]/, '') : 'events.startTime';
  var orderByReverse = options.orderByReverse === 'true' ? -1 : 1;
  var sortOptions = {};
  sortOptions[orderBy] = orderByReverse;

  var query = constructQueryNew(this, company, options);
  query.populate('events.interviewers', 'name')
    .populate('reviews.interviewer', 'name');
  if (options.pageSize && options.page) {
    query.skip(options.pageSize * (options.page - 1))
      .limit(options.pageSize);
  }
  query.exec(cb);
};

interviewSchema.statics.countNew = function (company, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }
  var query = constructQueryNew(this, company, options).count();
  return query.exec(cb);
};

interviewSchema.statics.queryOffered = function (company, options, cb) {
  var query = this.find({company: company, status: 'offered'});
  if (options.name)
    query.where('name').regex(new RegExp(options.name));
  query.select('name applyPosition').sort('updatedAt').exec(cb);
};

interviewSchema.statics.queryOfferAccepted = function (company, options, cb) {
  var query = this.find({company: company, status: 'offer accepted'});
  if (options.name)
    query.where('name').regex(new RegExp(options.name));
  if (options.startDate && options.endDate) {
    query.where('onboardDate').lte(options.endDate).gte(options.startDate);
  }

  query.select('name applyPosition onboardDate application');
  if (options.pageSize) {
    query.limit(options.pageSize).exec(cb);
  } else {
    query.sort('onboardDate').exec(cb);
  }
};

interviewSchema.statics.applyPositionsForCompany = function (company, cb) {
  var query = this.distinct('applyPosition');
  query.where('company', company);
  query.exec(cb);
};

interviewSchema.statics.applyPositionsForUser = function (user, cb) {
  var query = this.distinct('applyPosition');
  query.where('events.interviewers', user._id);
  query.exec(cb);
};


mongoose.model('Interview', interviewSchema);