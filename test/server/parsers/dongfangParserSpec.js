'use strict';

var fs = require('fs'),
  resumeParser = require('../../../server/parsers/dongfangParser'),
  expect = require('chai').expect;

describe('dongfangParser', function () {
  describe('#parse', function () {
    it('should parse dongfang resume correctly', function (done) {
      fs.readFile(__dirname + '/dongfangresume.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data
        });
        expect(resume.workExperience).to.have.length(4);
        console.log(resume);
        done(err);
      });
    });

    it('should parse dongfang another resume correctly', function (done) {
      fs.readFile(__dirname + '/dongfanganotherresume.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data
        });
        expect(resume.name).to.equal('汶晓萌');
        expect(resume.workExperience).to.have.length(2);
        console.log(resume);
        done(err);
      });
    });
  });
});