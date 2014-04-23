"use strict";

var mongoose = require('mongoose'),
    logger = require('../config/winston').logger(),
    mongoosastic = require('mongoosastic'),
    timestamps = require('mongoose-timestamps');

module.exports = function (config) {
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
            locations: {
                type: Array,
                es_type: 'string'
            },
            industry: {
                type: Array,
                es_type: 'string'
            },
            jobCategory: {
                type: Array,
                es_type: 'string'
            },
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
        company: String,
        channel: String,
        mail: String
    });

    resumeSchema.plugin(timestamps);
    resumeSchema.plugin(mongoosastic, {index: config.elastic_index, type: 'resume'});

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

    var stream = Resume.synchronize(), count = 0;

    stream.on('data', function (err, doc) {
        if (err) logger.error('index resume failed: ', err.stack);
        else count++;
    });
    stream.on('close', function () {
        logger.info('indexed ' + count + ' documents!');
    });
    stream.on('error', function (err) {
        logger.info('index resume failed', err.stack);
    });
};