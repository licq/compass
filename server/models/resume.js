'use strict';

var mongoose = require('mongoose'),
  logger = require('../config/winston').logger(),
  mongoosastic = require('mongoosastic'),
  config = require('../config/config'),
  _ = require('lodash'),
  moment = require('moment'),
  timestamps = require('mongoose-timestamp');

function makeTermFilter(queryValue, termKey) {
  if (queryValue) {
    var term = {};
    term[termKey] = queryValue;

    if (Array.isArray(queryValue)) {
      return {terms: term};
    } else {
      return {term: term };
    }
  }
}

var resumeSchema = mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  applyPosition: String,
  applyDate: {
    type: Date,
    default: Date.now()
  },
  photoUrl: String,
  matchRate: Number,
  yearsOfExperience: Number,

  birthday: Date,

  hukou: String, //户口
  residency: String,
  address: String,
  hobbies: String,
  civilState: {
    type: String,
    enum: ['married', 'single', 'divorced', 'confidential']
  },
  politicalStatus: {
    type: String,
    enum: ['party member', 'league member', 'democratic part', 'no party', 'citizen', 'others'],
    default: 'citizen'
  },

  careerObjective: {
    typeOfEmployment: {
      type: String,
      enum: ['fulltime', 'parttime', 'intern']
    },
    locations: [String],
    industry: [String],
    jobCategory: [String],
    targetSalary: {
      from: Number,
      to: Number
    },
    entryTime: {
      type: String,
      enum: ['immediately', 'within 1 week', 'within 1 month',
        '1 to 3 months', 'after 3 months', 'to be determined']
    },
    selfAssessment: String
  },
  job51Id: String,
  workExperience: [
    {
      from: Date,
      to: Date,
      company: String,
      industry: String,
      department: String,
      jobTitle: String,
      jobDescription: String
    }
  ],
  projectExperience: [
    {
      from: Date,
      to: Date,
      name: String,
      softwareEnvironment: String,
      hardwareEnvironment: String,
      developmentTools: String,
      description: String,
      responsibility: String
    }
  ],

  educationHistory: [
    {
      from: Date,
      to: Date,
      school: String,
      major: String,
      degree: String,
      description: String,
      overseas: Boolean
    }
  ],

  trainingHistory: [
    {
      from: Date,
      to: Date,
      institution: String,
      location: String,
      course: String,
      certification: String,
      description: String
    }
  ],

  certifications: [
    {
      date: Date,
      subject: String,
      score: String
    }
  ],

  languageSkills: [
    {
      language: {
        type: String,
        enum: ['english', 'japanese', 'mandarin', 'shanghaihua', 'cantonese', 'french', 'other']
      },
      level: {
        type: String,
        enum: ['not sure', 'average', 'good', 'very good', 'excellent']
      },
      readingAndWriting: {
        type: String,
        enum: ['not sure', 'average', 'good', 'very good', 'excellent']
      },
      listeningAndSpeaking: {
        type: String,
        enum: ['not sure', 'average', 'good', 'very good', 'excellent']
      }
    }
  ],

  inSchoolPractices: [
    {
      from: Date,
      to: Date,
      content: String
    }
  ],

  inSchoolStudy: [String ],
  addtionalInformation: String,

  languageCertificates: {
    english: {
      type: String,
      enum: ['not participate', 'not passed', 'cet4', 'cet6', 'tem4', 'tem8']
    },
    japanese: {
      type: String,
      enum: ['none', 'level1', 'level2', 'level3', 'level4']
    },
    toefl: Number,
    gre: Number,
    gmat: Number,
    ielts: Number,
    toeic: Number
  },

  itSkills: [
    {
      skill: String,
      experience: Number,
      level: {
        type: String,
        enum: ['none', 'expert', 'advanced', 'basic', 'limited']
      }
    }
  ],
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    index: true
  },
  channel: String,
  mail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mail'
  },
  status: {
    type: String,
    default: 'new',
    enum: ['new', 'undetermined', 'pursued', 'archived', 'offer accepted', 'interview', 'offered',
      'rejected', 'offer rejected', 'recruited', 'not recruited']
  },
  createdAtLocaltime: Date,
  updatedAtLocaltime: Date
});

resumeSchema.index({company: 1, name: 1, mobile: 1, createdAt: 1});

resumeSchema.virtual('highestDegree').get(function () {
  if (this.educationHistory && this.educationHistory.length > 0) {
    return this.educationHistory[0].degree;
  }
});

resumeSchema.statics.query = function (params, callback) {
  var queryConditions = {
    query: {
      filtered: {
        filter: {
          and: []
        }
      }
    },
    facets: {
      applyPosition: {
        terms: {
          field: 'applyPosition.original'
        }
      },
      highestDegree: {
        terms: {
          field: 'highestDegree'
        }
      },
      age: {
        histogram: {
          key_script: "DateTime.now().year - doc['birthday'].date.year",
          value_script: 1,
          interval: 5
        }
      },
      status: {
        terms: {
          field: 'status'
        }
      }
    }
  };

  if (params.q) {
    queryConditions.query.filtered.query = {
      bool: {
        must: _.map(params.q.split(' '), function (item) {
          return {
            multi_match: {
              query: item,
              analyzer: 'ik',
              type: 'phrase',
              slop: 1,
              fields: [
                'name',
                'careerObjective.selfAssessment',
                'certifications.subject',
                'channel',
                'email',
                'inSchoolPractices.content',
                'inSchoolStudy',
                'itSkills.skill',
                'languageCertificates.english',
                'languageSkills.language',
                'educationHistory.major',
                'educationHistory.school',
                'projectExperience.description',
                'projectExperience.developmentTools',
                'projectExperience.name',
                'projectExperience.responsibility',
                'projectExperience.softwareEnvironment',
                'workExperience.company',
                'workExperience.department',
                'workExperience.industry',
                'workExperience.jobTitle',
                'workExperience.jobDescription'
              ]
            }
          };
        })
      }
    };
  } else {
    queryConditions.query.filtered.query = {
      match_all: {}
    };
  }

  if (params.page && params.pageSize) {
    queryConditions.from = (params.page - 1) * params.pageSize;
    queryConditions.size = params.pageSize;
  }

  var filters = queryConditions.query.filtered.filter.and;
  if (params.company) {
    filters.push({term: {
      company: params.company
    }});
  }

  var highestDegreeFilter = makeTermFilter(params.highestDegree, 'highestDegree');
  if (highestDegreeFilter) {
    filters.push(highestDegreeFilter);
  }

  var applyPositionFilter = makeTermFilter(params.applyPosition, 'applyPosition.original');
  if (applyPositionFilter) {
    filters.push(applyPositionFilter);
  }

  if (params.positions && params.positions.length > 0) {
    var positionsFilter = makeTermFilter(_.map(params.positions, 'name'), 'applyPosition.original');
    filters.push(positionsFilter);
  }

  var statusFilter = makeTermFilter(params.status, 'status');
  if (statusFilter) {
    filters.push(statusFilter);
  }

  if (params.age) {
    if (!Array.isArray(params.age)) {
      params.age = [params.age];
    }
    filters.push({or: _.map(params.age, function (age) {
      age = _.parseInt(age);
      return {
        script: {
          script: 'DateTime.now().year -doc[\'birthday\'].date.year >= lowerAge ' +
            '&& DateTime.now().year -doc[\'birthday\'].date.year <= higherAge',
          params: {
            lowerAge: age,
            higherAge: age + 4
          }
        }
      };
    })});
  }

  if (filters.length === 0) {
    delete queryConditions.query.filtered.filter.and;
  }

  logger.debug(JSON.stringify(queryConditions));
  this.search(queryConditions, function (err, results) {
    if (err) return callback(err);

    results.hits.hits = _.map(results.hits.hits, function (hit) {
      hit._source._id = hit._id;
      return hit._source;
    });
    return callback(null, results);
  });
};

resumeSchema.statics.createOrUpdateAndIndex = function (data, cb) {
  var model = this;
  model.findOne({mail: data.mail}, function (err, resume) {
    if (err) return cb(err);
    if (resume) {
      resume.merge(data);
    } else {
      resume = model(data);
    }
    resume.saveAndIndex(cb);
  });
};

resumeSchema.post('remove', function () {
  this.unIndex();
});

resumeSchema.plugin(timestamps);
resumeSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdAtLocaltime = moment(this.createdAt).add('hours', 8).toDate();
  }
  this.updatedAtLocaltime = moment(this.updatedAt).add('hours', 8).toDate();
  next();
});

resumeSchema.pre('save', function (next) {
  var self = this;
  if (self.isNew) {
    mongoose.model('ApplicationSetting').findOne({company: self.company}).select('filterSamePerson').exec(function (err, as) {
      if (err || !as) return next();
      if (as.filterSamePerson === 0) return next();
      self.constructor.count({name: self.name, mobile: self.mobile, email: self.email, createdAt: {$gt: moment().add('months', 0 - as.filterSamePerson).toDate()}})
        .exec(function (err, resumeCount) {
          if (err || resumeCount === 0) return next();
          self.status = 'archived';
          next();
        });
    });
  } else {
    next();
  }
});

resumeSchema.plugin(mongoosastic, {
  index: config.elastic.index,
  host: config.elastic.host,
  port: config.elastic.port,
  mapping: {
    properties: {
      applyDate: {
        type: 'date',
        format: 'dateOptionalTime',
        include_in_all: false,
        index: 'not_analyzed'
      },
      applyPosition: {
        type: 'multi_field',
        fields: {
          applyPosition: {
            type: 'string',
            include_in_all: true,
            analyzer: 'ik'
          },
          original: {
            type: 'string',
            index: 'not_analyzed'
          }
        }
      },
      birthday: {
        type: 'date',
        format: 'dateOptionalTime',
        include_in_all: false,
        index: 'not_analyzed'
      },
      careerObjective: {
        type: 'object',
        include_in_all: false,
        properties: {
          entryTime: {
            index: 'not_analyzed',
            type: 'string'
          },
          industry: {
            index: 'no',
            type: 'string'
          },
          jobCategory: {
            index: 'no',
            type: 'string'
          },
          locations: {
            index: 'no',
            type: 'string'
          },
          selfAssessment: {
            type: 'string',
            analyzer: 'ik'
          },
          targetSalary: {
            properties: {
              from: {
                index: 'not_analyzed',
                type: 'integer'
              },
              to: {
                index: 'not_analyzed',
                type: 'integer'
              }
            }
          },
          typeOfEmployment: {
            index: 'no',
            type: 'string'
          }
        }
      },
      certifications: {
        properties: {
          _id: {
            index: 'no',
            type: 'string'
          },
          date: {
            type: 'date',
            format: 'dateOptionalTime',
            index: 'no'
          },
          score: {
            index: 'no',
            type: 'string'
          },
          subject: {
            analyzer: 'ik',
            type: 'string'
          }
        }
      },
      channel: {
        analyzer: 'ik',
        type: 'string'
      },
      civilState: {
        index: 'no',
        type: 'string'
      },
      company: {
        index: 'not_analyzed',
        include_in_all: false,
        type: 'string'
      },
      createdAt: {
        type: 'date',
        format: 'dateOptionalTime',
        include_in_all: false,
        index: 'not_analyzed'
      },
      highestDegree: {
        type: 'string',
        index: 'not_analyzed',
        include_in_all: false
      },
      educationHistory: {
        properties: {
          _id: {
            type: 'string',
            index: 'no'
          },
          degree: {
            type: 'string',
            index: 'not_analyzed',
            boost: 5
          },
          from: {
            type: 'date',
            format: 'dateOptionalTime',
            index: 'no'
          },
          major: {
            type: 'string',
            analyzer: 'ik',
            boost: 5
          },
          school: {
            type: 'string',
            analyzer: 'ik',
            boost: 10
          },
          to: {
            type: 'date',
            format: 'dateOptionalTime',
            index: 'no'
          }
        }
      },
      email: {
        type: 'string',
        index: 'not_analyzed'
      },
      gender: {
        type: 'string',
        index: 'no'
      },
      hukou: {
        type: 'string',
        index: 'no'
      },
      inSchoolPractices: {
        properties: {
          _id: {
            type: 'string',
            index: 'no'
          },
          content: {
            type: 'string',
            boost: 0.1
          },
          from: {
            type: 'date',
            format: 'dateOptionalTime',
            index: 'no'
          },
          to: {
            type: 'date',
            format: 'dateOptionalTime',
            index: 'no'
          }
        }
      },
      inSchoolStudy: {
        type: 'string',
        boost: 0.1
      },
      itSkills: {
        properties: {
          _id: {
            type: 'string',
            index: 'no'
          },
          experience: {
            type: 'long',
            index: 'no'
          },
          level: {
            type: 'string',
            index: 'no'
          },
          skill: {
            type: 'string',
            boost: 0.3
          }
        }
      },
      languageCertificates: {
        properties: {
          english: {
            type: 'string',
            index: 'not_analyzed'
          },
          gmat: {
            type: 'double',
            index: 'no'
          },
          gre: {
            type: 'double',
            index: 'no'
          },
          ielts: {
            type: 'double',
            index: 'no'
          },
          japanese: {
            type: 'string',
            index: 'no'
          },
          toefl: {
            type: 'double',
            index: 'no'
          },
          toeic: {
            type: 'double',
            index: 'no'
          }
        }
      },
      languageSkills: {
        properties: {
          _id: {
            type: 'string',
            index: 'no'
          },
          language: {
            type: 'string',
            index: 'not_analyzed'
          },
          listeningAndSpeaking: {
            type: 'string',
            index: 'no'
          },
          readingAndWriting: {
            type: 'string',
            index: 'no'
          }
        }
      },
      mail: {
        type: 'string',
        index: 'no'
      },
      mobile: {
        type: 'string',
        index: 'no'
      },
      photoUrl: {
        type: 'string',
        index: 'no'
      },
      name: {
        type: 'string',
        boost: 15,
        analyzer: 'ik'
      },
      additionalInformation: {
        type: 'string',
        analyzer: 'ik'
      },
      address: {
        type: 'string',
        analyzer: 'ik'
      },
      hobbies: {
        type: 'string',
        analyzer: 'ik'
      },
      politicalStatus: {
        type: 'string',
        index: 'no'
      },
      projectExperience: {
        properties: {
          _id: {
            index: 'no',
            type: 'string'
          },
          description: {
            type: 'string',
            boost: 0.2,
            analyzer: 'ik'
          },
          developmentTools: {
            type: 'string',
            index: 'no'
          },
          from: {
            type: 'date',
            format: 'dateOptionalTime',
            index: 'no'
          },
          hardwareEnvironment: {
            type: 'string',
            index: 'no'
          },
          name: {
            type: 'string',
            analyzer: 'ik',
            boost: 3
          },
          responsibility: {
            type: 'string',
            analyzer: 'ik'
          },
          softwareEnvironment: {
            type: 'string',
            index: 'no'
          },
          to: {
            type: 'date',
            format: 'dateOptionalTime',
            index: 'no'
          }
        }
      },
      residency: {
        type: 'string',
        index: 'no'
      },
      updatedAt: {
        type: 'date',
        format: 'dateOptionalTime',
        index: 'no'
      },
      workExperience: {
        properties: {
          _id: {
            type: 'string',
            index: 'no'
          },
          company: {
            type: 'string',
            analyzer: 'ik',
            boost: 10
          },
          department: {
            type: 'string',
            analyzer: 'ik',
            boost: 2
          },
          from: {
            type: 'date',
            format: 'dateOptionalTime',
            index: 'no'
          },
          industry: {
            type: 'string',
            analyzer: 'ik',
            boost: 0.5
          },
          jobDescription: {
            type: 'string',
            analyzer: 'ik',
            boost: 2
          },
          jobTitle: {
            type: 'string',
            analyzer: 'ik',
            boost: 5
          },
          to: {
            type: 'date',
            format: 'dateOptionalTime',
            index: 'no'
          }
        }
      },
      yearsOfExperience: {
        type: 'long',
        index: 'not_analyzed',
        include_in_all: false
      },
      status: {
        type: 'string',
        index: 'not_analyzed'
      }
    }
  }
});

mongoose.model('Resume', resumeSchema);
