'use strict';

var fs = require('fs'),
    resumeParser = require('../../../server/parsers/remoteResumeParser'),
    async = require('async'),
    expect = require('chai').expect;

describe.skip('remoteResumeParser', function () {
    describe('#parse', function () {
        it('should parse resume correctly', function (done) {
            this.timeout(0);
            fs.readFile(__dirname + '/liepinresume.html', 'utf-8', function (err, data) {
                resumeParser.parse(data, function (err, res, resume) {
                    console.log(resume);
                    expect(resume.name).to.equal('许东东');
                    expect(resume.email).to.equal('zxpxdd3202@sohu.com');
                    expect(resume.mobile).to.equal('13805730593');
                    expect(resume.yearsOfExperience).to.equal(10);
                    done(err);
                });
            });
        });

        it('should parse doc file from mail correctly', function (done) {
            this.timeout(0);
            var mongoose = require('mongoose');
            var emailSchema = new mongoose.Schema({
                subject:String,
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
                    resumeParser.parse(email.attachments[0].content, function (err, res, resume) {
                        console.log(email.subject);
                        console.log(email.attachments[0].fileName);
                        console.log(resume);
                        callback(err, resume);
                    });
                }, function (err) {
                    done(err);
                });
            });
        });
    });
});

