'use strict';

var fs = require('fs'),
  resumeParser = require('../../../server/parsers/job51Parser'),
  expect = require('chai').expect;

describe('job51Parser', function () {
  describe('#parse', function () {
    it('should parse 51job resume correctly', function (done) {
      fs.readFile(__dirname + '/51jobresume.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data
        });
        console.log(resume);
        expect(resume.name).to.equal('蒋华辛');
        expect(resume.email).to.equal('jianghuaxin@live.cn');
        expect(resume.mobile).to.equal('18645149586');
        expect(resume.applyPosition).to.equal('Java开发实习生（上海）');
        expect(resume.yearsOfExperience).to.equal(0);
        done(err);
      });
    });

    it('should parse 51job another resume correctly', function (done) {
      fs.readFile(__dirname + '/51jobanotherresume.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data
        });
//                expect(resume.name).to.equal('顾欢');
//                expect(resume.projectExperience).to.have.length(2);
        console.log(resume);
        done(err);
      });
    });

    it('should parse 51job download resume correctly', function (done) {
      fs.readFile(__dirname + '/51jobdownloadresume.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data
        });
//                expect(resume.name).to.equal('顾欢');
//                expect(resume.projectExperience).to.have.length(2);
        console.log(resume);
        done(err);
      });
    });
  });
});