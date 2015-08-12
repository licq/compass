'use strict';

var request = require('request'),
    config = require('../config/config'),
    helper = require('../utilities/helper'),
    async = require('async'),
    _ = require('lodash');

function postData(data, callback) {
    var req = request.post({
        uri: config.resumeParser.host
    }, function (err, res, body) {
        var resume = JSON.parse(body);
        callback(err, resume);
    });

    var form = req.form();
    form.append('resumeFile', data, {filename: 'resumefile'});
}

function removeNullnLowerCase(obj) {
    if (obj) {
        if (_.isString(obj))
            return obj.toLowerCase();

        if (_.isArray(obj)) {
            if (obj.length === 0) return;
            return _.map(obj, function (value) {
                return removeNullnLowerCase(value);
            });
        }

        if (_.isPlainObject(obj)) {
            return _.mapValues(_.pick(obj, function (field) {
                return !_.isNull(field) || !_.isUndefined(field);
            }), function (value) {
                return removeNullnLowerCase(value);
            });
        }
    }
}

function extractDaterange(data) {
    return _.map(data, function (item) {
        if (item.dateRange) {
            item.from = item.dateRange.from;
            item.to = item.dateRange.to;
        }
        return item;
    });
}

function reconstruct(data) {
    var resume = {};

    data = removeNullnLowerCase(data);

    resume = _.extend(resume, data);

    if (resume.languageSkills) {
        resume.languageSkills = _.compact(_.map(resume.languageSkills, function (item) {
            if (item.language) item.language = helper.parseLanguage(item.language);
            if (item.level) item.level = item.level.toLowerCase();
            if (item.readingAndWritingLevel) item.readingAndWritingLevel = item.readingAndWritingLevel.toLowerCase();
            if (item.listeningAndSpeakingLevel) item.listeningAndSpeakingLevel = item.listeningAndSpeakingLevel.toLowerCase();
        }));
    }
    resume.civilState = helper.parseCivilState(data.civilState);
    resume.politicalStatus = helper.parseCivilState(data.politicalStatus);
    resume.careerObjective.entryTime = helper.parseEntryTime(data.careerObjective.entryTime);
    resume.careerObjective.selfAssessment = resume.selfAssessment;

    resume.workExperience = extractDaterange(resume.works);
    resume.projectExperience = extractDaterange(resume.projects);
    resume.educationHistory = extractDaterange(resume.educations);
    resume.trainingHistory = extractDaterange(resume.trainings);
    resume.inSchoolPractice = extractDaterange(resume.inSchoolPractices);
    delete resume.works;
    delete resume.projects;
    delete resume.educations;
    delete resume.trainings;
    delete resume.inSchoolPractices;

    return resume;
}

exports.parse = function (mail, callback) {
    try{
        var resume, parseErrors;
        var attachments = _.map(_.filter(mail.attachments, function (attachment) {
            if (attachment.fileName && attachment.fileName.search(/(\.mht|\.doc.|\.pdf｜\.txt)$/)) {
                return true;
            }
        }), function (item) {
            return item.content;
        });

        var data = attachments;
        if (mail.html) {
            data = [new Buffer(mail.html)].concat(attachments);
        }
        async.detectSeries(data, function (item, cb) {

                postData(item, function (err, res) {
                    if (res.name && res.mobile) {
                        resume = reconstruct(res);
                        if (err) parseErrors = err;
                        cb(true);
                    } else {
                        cb(false);
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
                callback(resume);
            });
    }
    catch (e) {
        errors.push(e.message);
        logger.error(e.stack);
    }
};