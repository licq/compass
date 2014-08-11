'use strict';

var fs = require('fs'),
  resumeParser = require('../../../server/parsers/hr61Parser'),
  expect = require('chai').expect;

describe('hr61Parser', function () {
  describe('#parse', function () {
    it.skip('should parse 61hr resume correctly', function (done) {
      fs.readFile(__dirname + '/hr61resume.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data
        });
        expect(resume.name).to.equal('蒋华辛');
        expect(resume.email).to.equal('jianghuaxin@live.cn');
        expect(resume.mobile).to.equal('18645149586');
        expect(resume.applyPosition).to.equal('Java开发实习生（上海）');
        expect(resume.yearsOfExperience).to.equal(0);
        console.log(resume);
        done(err);
      });
    });

    it('should parse 61hr another resume correctly', function (done) {
      fs.readFile(__dirname + '/61hr2resume.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data,
          subject: 'wanglingyan0908 应聘贵公司 采购部主任 Purchasing Officer 职位'
        });
//                expect(resume.name).to.equal('顾欢');
//                expect(resume.projectExperience).to.have.length(2);
        console.log(resume);
        done(err);
      });
    });
  });
});