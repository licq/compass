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
        expect(resume.projectExperience).to.be.exist;
        done(err);
      });
    });

    it('should parse 51job v3t resume correctly', function (done) {
      fs.readFile(__dirname + '/51jobv3t.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data
        });
        console.log(resume);
        expect(resume.name).to.equal('贾军柯');
        expect(resume.email).to.equal('670566237@qq.com');
        expect(resume.mobile).to.equal('18657370337');
        expect(resume.applyPosition).to.equal('Java开发工程师（上海）');
        expect(resume.yearsOfExperience).to.equal(-0);
        done(err);
      });
    });

    it('should parse 51job v2t resume correctly', function (done) {
      fs.readFile(__dirname + '/51jobv2t.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data
        });
        console.log(resume);
        expect(resume.name).to.equal('穆克良');
        expect(resume.email).to.equal('mukeliang@163.com');
        expect(resume.mobile).to.equal('15026758640');
        expect(resume.applyPosition).to.equal('技术总监（上海-卢湾区）');
        expect(resume.yearsOfExperience).to.equal(8);
        expect(resume.projectExperience).to.have.length(8);
        expect(resume.workExperience).to.have.length(3);
        done(err);
      });
    });

    it.skip('should parse 51job v1bt resume correctly', function (done) {
      fs.readFile(__dirname + '/51jobv1bt.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data
        });
        console.log(resume);
        expect(resume.name).to.equal('巫章丽');
        expect(resume.email).to.equal('mukeliang@163.com');
        expect(resume.mobile).to.equal('15026758640');
        expect(resume.applyPosition).to.equal('技术总监（上海-卢湾区）');
        expect(resume.yearsOfExperience).to.equal(8);
        expect(resume.projectExperience).to.have.length(8);
        expect(resume.workExperience).to.have.length(3);
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
        expect(resume.projectExperience).to.have.length(9);
        console.log(resume);
        done(err);
      });
    });

    it.skip('should parse 51job temp correctly', function (done) {
      fs.readFile(__dirname + '/51jobtemp.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data
        });
        expect(resume.name).to.exist;
        expect(resume.email).to.exist;
        expect(resume.mobile).to.exist;
        expect(resume.applyPosition).to.exist;

        console.log(resume);
//        require('mongoose').model('Resume').create(resume, function (err, r) {
          done(err);
//        });
      });
    });
  });
});