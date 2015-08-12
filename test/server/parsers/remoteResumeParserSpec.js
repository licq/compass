'use strict';

var fs = require('fs'),
    resumeParser = require('../../../server/parsers/remoteResumeParser'),
    async = require('async'),
    mongoose = require('mongoose'),
    Resume = mongoose.model('Resume'),
    helper = require('../testHelper'),
    expect = require('chai').expect;

describe('remoteResumeParser', function () {

    beforeEach(function (done) {
        helper.clearCollections('Email', 'Resume', done);
    });

    describe('#parse', function () {
        it('should parse resume correctly', function (done) {
            this.timeout(0);
            fs.readFile(__dirname + '/liepinresume.html', 'utf-8', function (err, data) {
                resumeParser.parse({html: data, fromAddress: 'tt.zhaopin.com'}, function (resume) {
                    //console.log(resume);
                    expect(resume.name).to.equal('许东东');
                    expect(resume.email).to.equal('zxpxdd3202@sohu.com');
                    expect(resume.mobile).to.equal('13805730593');
                    expect(resume.yearsOfExperience).to.equal(10);
                    done(err);
                });
            });
        });

        it.skip('should parse doc file from mail correctly', function (done) {
            this.timeout(0);
            var emailSchema = new mongoose.Schema({
                subject: String,
                html: String,
                company: mongoose.Schema.Types.ObjectId,
                fromAddress: String,
                attachments: [
                    {
                        contentType: String,
                        fileName: String,
                        contentDisposition: String,
                        contentId: String,
                        transferEncoding: String,
                        length: Number,
                        generatedFileName: String,
                        checksum: String,
                        content: Buffer
                    }
                ]
            });
            var tempemail = mongoose.model('Tempemail', emailSchema);
            tempemail.find({}, function (err, emails) {
                async.eachSeries(emails, function (email, callback) {
                    email.mailId = email._id;
                    resumeParser.parse(email, function (resume) {
                        if (resume) {
                            Resume.createOrUpdateAndIndex(resume, function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                callback(err, resume);
                            });
                        } else {
                                callback(err, resume);
                        }

                    });
                }, function (err) {
                    done(err);
                });
            });
        });
    });
});

