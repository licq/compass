'use strict';

var fs = require('fs'),
  resumeParser = require('../../../server/parsers/ganjiParser'),
  expect = require('chai').expect;

describe('ganjiParser', function () {
  describe('#parse', function () {
    it('should parse ganji resume correctly', function (done) {
      fs.readFile(__dirname + '/ganji1.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data
        });
        console.log(resume);
        expect(resume.name).to.equal('何建平');
        expect(resume.gender).to.equal('male');
        expect(resume.mobile).to.equal('13901897802');
        expect(resume.degree).to.equal('high school');
        expect(resume.applyPosition).to.equal('客运司机');
        expect(resume.educationHistory).have.length(1);
        expect(resume.workExperience.jobDescription).to.exist;
        expect(resume.careerObjective.selfAssessment).to.exist;
        expect(resume.careerObjective.targetSalary).to.exist;
        done(err);
      });
    });

    it('should parse anoth ganji resume correctly', function (done) {
      fs.readFile(__dirname + '/ganji2.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data
        });
        console.log(resume);
        expect(resume.name).to.equal('梁义');
        expect(resume.gender).to.equal('male');
        expect(resume.mobile).to.equal('13611903164');
        expect(resume.email).to.equal('1344013557@qq.com');
        expect(resume.degree).to.equal('polytechnic');
        expect(resume.applyPosition).to.equal('西餐厨师');
        expect(resume.educationHistory).have.length(1);
        expect(resume.workExperience.jobDescription).to.exist;
        expect(resume.careerObjective.selfAssessment).to.exist;
        expect(resume.careerObjective.targetSalary).to.exist;
        done(err);
      });
    });

    it('should parse ganji resume correctly', function (done) {
      fs.readFile(__dirname + '/ganji3.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data
        });
        console.log(resume);
        expect(resume.name).to.equal('余嘉财');
        expect(resume.gender).to.equal('male');
        expect(resume.mobile).to.equal('13801823925');
        expect(resume.degree).to.equal('high school');
        expect(resume.applyPosition).to.equal('班车司机');
        expect(resume.workExperience.jobDescription).to.exist;
        expect(resume.careerObjective.selfAssessment).to.exist;
        expect(resume.careerObjective.targetSalary).to.exist;
        done(err);
      });
    });
  });
});