"use strict";

var mongoose = require('mongoose'),
    logger = require('../config/winston').logger(),
    mongoosastic = require('mongoosastic'),
    config = require('../config/config'),
    timestamps = require('mongoose-timestamps');

var workSchema = mongoose.Schema({
    from: Date,
    to: Date,
    company: String,
    industry: String,
    department: String,
    jobTitle: String,
    jobDescription: String
});

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
    matchRate: Number,
    yearsOfExperience: Number,

    birthday: Date,

    hukou: String, //户口
    residency: String,
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

    workExperience: [workSchema],
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
                enum: ['english', 'japanese', 'other']
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
        ref: 'Company'
    },
    channel: String,
    mail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mail'
    }
});

resumeSchema.plugin(timestamps);
resumeSchema.plugin(mongoosastic, {
    index: config.elastic_index,
    host: config.elastic_host,
    port: config.elastic_port,
    mapping: {
        properties: {
            applyDate: {
                type: 'date',
                format: 'dateOptionalTime',
                include_in_all: false,
                index: 'not_analyzed'
            },
            applyPosition: {
                type: 'string',
                include_in_all: false,
                index: 'not_analyzed'
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
                        index: 'no',
                        type: 'string'
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
                index: 'not_analyzed',
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
            created_at: {
                type: 'date',
                format: 'dateOptionalTime',
                include_in_all: false,
                index: 'not_analyzed'
            },
            educationHistory: {
                properties: {
                    _id: {
                        type: 'string',
                        index: 'no'
                    },
                    degree: {
                        type: 'string',
                        index: 'not_analyzed'
                    },
                    from: {
                        type: 'date',
                        format: 'dateOptionalTime',
                        index: 'no'
                    },
                    major: {
                        type: 'string',
                        analyzer: 'ik'
                    },
                    school: {
                        type: 'string',
                        analyzer: 'ik'
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
            name: {
                type: 'string',
                boost: 5,
                index: 'not_analyzed',
                norms: {
                    enabled: true
                }
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
            updated_at: {
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
                        boost: 5
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
                        boost: 3
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
            }
        }
    }
});

resumeSchema.post('save', function (resume) {
    var Application = mongoose.model('Application');
    var application = new Application({
        name: resume.name,
        applyPosition: resume.applyPosition,
        birthday: resume.birthday,
        company: resume.company,
        gender: resume.gender,
        status: 'new',
        resume: resume._id,
        applyDate: resume.applyDate || new Date()
    });
    if (resume.educationHistory && resume.educationHistory.length > 0) {
        application.degree = resume.educationHistory[0].degree;
    }
    application.save(function (err) {
        if (err) logger.error('save application to mongo failed ', resume._id, err.stack);
    });
});

var Resume = mongoose.model('Resume', resumeSchema);
Resume.createMapping(function (err, mapping) {
    if (err) {
        logger.error('error creating mapping (you can safely ignore this)', err);
    }
    var stream = Resume.synchronize() , count = 0;

    stream.on('data', function (err, doc) {
        count++;
    });
    stream.on('close', function () {
        console.log('indexed ' + count + ' documents!');
    });
    stream.on('error', function (err) {
        console.log(err);
    });
});

