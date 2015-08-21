'use strict';

var request = require('request'),
    config = require('../config/config'),
    helper = require('../utilities/helper'),
    logger = require('../config/winston').logger(),
    async = require('async'),
    _ = require('lodash');

function postData(data, callback) {
    logger.info('posting...' + data.subject);
    if (!data.buffer)
        return callback('no data to parse ', null, null);
    var req = request.post({
        uri: config.resumeParser.host
    }, callback);

    var form = req.form();
    form.append('resumeFile', data.buffer, {filename: data.fileName});
}

function removeNull(obj) {
    if (obj) {
        if (_.isArray(obj)) {
            if (obj.length === 0) return;
            return _.map(obj, function (value) {
                return removeNull(value);
            });
        }

        if (_.isPlainObject(obj)) {
            return _.mapValues(_.pick(obj, function (field) {
                return !_.isNull(field) || !_.isUndefined(field);
            }), function (value) {
                return removeNull(value);
            });
        }
        return obj;
    }
}

function extractDaterange(input) {
    return _.map(input, function (item) {
        if (item.dateRange) {
            item.from = item.dateRange.from;
            item.to = item.dateRange.to;
        }
        return item;
    });
}

function mapItSkills(skills) {
    return _.map(skills, function (skill) {
        skill.skill = skill.name;
        skill.experience = helper.parseSkillExperience(skill.experience);
        skill.level = helper.parseItSkillLevel(skill.level);
        return skill;
    });
}

function reconstruct(input) {
    var resume = removeNull(input);

    if (resume.languageSkills) {
        resume.languageSkills = _.map(_.compact(resume.languageSkills), function (item) {
            item.language = helper.parseLanguage(item.language);
            item.level = helper.parseLanguageLevel(item.level);
            item.readingAndWritingLevel = helper.parseLanguageLevel(item.readingAndWritingLevel);
            item.listeningAndSpeakingLevel = helper.parseLanguageLevel(item.listeningAndSpeakingLevel);
            return item;
        });
    }
    resume.civilState = helper.parseCivilState(input.civilState);
    resume.politicalStatus = helper.parsePoliticalStatus(input.politicalStatus);
    resume.gender = helper.parseGender(input.gender);

    resume.careerObjective.entryTime = helper.parseEntryTime(input.careerObjective.entryTime);
    resume.careerObjective.typeOfEmployment = helper.parseTypeOfEmployment(input.careerObjective.typeOfEmployment);
    resume.careerObjective.selfAssessment = resume.selfAssessment;
    resume.careerObjective.industry = resume.careerObjective.industries;
    resume.careerObjective.jobCategory = resume.careerObjective.jobCategories;
    resume.careerObjective.jobCategory = resume.careerObjective.jobCategories;

    resume.workExperience = extractDaterange(resume.works);
    resume.projectExperience = extractDaterange(resume.projects);
    resume.educationHistory = extractDaterange(resume.educations);
    resume.trainingHistory = extractDaterange(resume.trainings);
    resume.inSchoolPractice = extractDaterange(resume.inSchoolPractices);

    resume.itSkills = mapItSkills(resume.skills);

    resume.languageCertificates = {
        english: helper.parseEnglishCertificate(resume.languageCertificationEnglish),
        japanese: helper.parseEnglishCertificate(resume.languageCertificationJapanese)
    };
    if (resume.birthday)
        resume.birthday = new Date(resume.birthday);
    delete resume.works;
    delete resume.projects;
    delete resume.educations;
    delete resume.trainings;
    delete resume.inSchoolPractices;

    return resume;
}

exports.parse = function (mail, callback) {
    var resume, parseErrors;
    var data = _.compact(_.map(_.filter(mail.attachments, function (attachment) {
        if (attachment.fileName && attachment.fileName.search(/(\.mht|\.doc.?|\.pdf|\.txt|\.htm.?|\.rtf)$/) !== -1) {
            return true;
        }
    }), function (item) {
        if (item.content) {
            if (_.isArray(item.content))
                item.content = new Buffer(item.content);
            return {buffer: item.content, fileName: item.fileName};
        }
    }));

    if (mail.html) {
        data.unshift({buffer: new Buffer(mail.html), fileName: mail.subject + '.html'});
    }
    async.detectSeries(data, function (item, cb) {
            //todo no series
            item.subject = mail.subject;
            postData(item, function (err, res, body) {
                try {

                    if (err) logger.error(err);
                    parseErrors = err;

                    if (body) body = JSON.parse(body);
                    if (body && body.name && (body.mobile || body.phone)) {
                        resume = reconstruct(body);
                        cb(true);
                    } else {
                        cb(false);
                    }
                } catch (e) {
                    logger.error('reconstruct resume ' + mail.subject + 'error: ' + e.message);
                    return cb(false);
                }
            });
        },
        function (result) {
            if (result) {
                resume.company = mail.company;
                resume.mail = mail.mailId;
                resume.channel = helper.parseChannel(mail.fromAddress);
                resume.parseErrors = parseErrors;
                if (!resume.applyPosition) {
                    resume.applyPosition = helper.parseApplyPosition(mail.fromAddress, mail.subject);
                }
            }
            callback(parseErrors, resume);
        });
};