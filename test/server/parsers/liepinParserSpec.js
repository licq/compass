'use strict';

var fs = require('fs'),
  resumeParser = require('../../../server/parsers/liepinParser'),
  expect = require('chai').expect;

describe('liepinParser', function () {
  describe('#parse', function () {
    it('should parse liepin resume correctly', function (done) {
      fs.readFile(__dirname + '/liepinresume.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data
        });
        console.log(resume);
        expect(resume.name).to.equal('许东东');
        expect(resume.email).to.equal('zxpxdd3202@sohu.com');
        expect(resume.mobile).to.equal('13805730593');
        expect(resume.applyPosition).to.equal('技术总监 |上海');
        expect(resume.yearsOfExperience).to.equal(10);
        done(err);
      });
    });

    it('should parse liepin another resume correctly', function (done) {
      fs.readFile(__dirname + '/liepinanotherresume.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data
        });
        console.log(resume);
        done(err);
      });
    });
    it('should parse liepin 3 resume correctly', function (done) {
      fs.readFile(__dirname + '/liepin3resume.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data
        });
        console.log(resume);
        done(err);
      });
    });
  });
});