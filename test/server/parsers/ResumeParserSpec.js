var fs = require('fs'),
    resumeParser = require('../../../server/parsers/resumeParser'),
    expect = require('chai').expect;

describe('ResumeParser', function () {

    describe('#parse', function () {
        it('should parse the resume correctly', function (done) {
            fs.readFile(__dirname + '/zhaopinresume.html', 'utf-8', function (err, data) {
                var resume = resumeParser.parse(data);
                console.log(resume);
                done(err);
            });
        });

        it.only('should parse 51job resume correctly', function (done) {
            fs.readFile(__dirname + '/51jobresume.html', 'utf-8', function (err, data) {
                var resume = resumeParser.parse51Job(data);
                console.log(resume);
                done(err);
            });
        });
    });
});