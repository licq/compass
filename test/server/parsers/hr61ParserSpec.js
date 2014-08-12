'use strict';

var fs = require('fs'),
  resumeParser = require('../../../server/parsers/hr61Parser');

describe('hr61Parser', function () {
  describe('#parse', function () {
    it('should parse 61hr resume correctly', function (done) {
      fs.readFile(__dirname + '/61hrresume.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data
        });
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
        console.log(resume);
        done(err);
      });
    });

    it('should parse 61hr english resume correctly', function (done) {
      fs.readFile(__dirname + '/61hrenresume.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data,
          subject: 'wanglingyan0908 应聘贵公司 采购部主任 Purchasing Officer 职位'
        });
        console.log(resume);
        done(err);
      });
    });
  });
});