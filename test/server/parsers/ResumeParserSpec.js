var fs = require('fs'),
    resumeParser = require('../../../server/parsers/resumeParser'),
    expect = require('chai').expect;

describe.only('ResumeParser', function () {

    describe('#parse', function () {
        it('should parse the resume correctly', function (done) {
            fs.readFile(__dirname + '/zhaopinresume.html', 'utf-8', function (err, data) {
                var resume = resumeParser.parse(data);
                console.log(resume);
                done(err);
            });
        });
    });
});