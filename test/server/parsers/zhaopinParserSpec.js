var fs = require('fs'),
    resumeParser = require('../../../server/parsers/zhaopinParser'),
    expect = require('chai').expect;

describe('ZhaopinParser', function () {

    describe('#parse', function () {
        it('should parse the resume correctly', function (done) {
            fs.readFile(__dirname + '/zhaopinresume.html', 'utf-8', function (err, data) {
                var resume = resumeParser.parse({
                    html:data
                });
                expect(resume.name).to.equal('朱巧满');
                console.log(resume);
                done(err);
            });
        });

        it('should parse zhaopin another resume correctly', function (done) {
            fs.readFile(__dirname + '/zhaopinanotherresume.html', 'utf-8', function (err, data) {
                var resume = resumeParser.parse({
                    html: data
                });
                expect(resume.projectExperience).to.have.length(3);
                console.log(resume);
                done(err);
            });
        });
    });
});