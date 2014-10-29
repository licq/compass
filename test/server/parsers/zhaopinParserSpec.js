'use strict';

var fs = require('fs'),
  resumeParser = require('../../../server/parsers/zhaopinParser'),
  expect = require('chai').expect;

describe.only('ZhaopinParser', function () {

  describe('#parse', function () {
    it('should parse the resume correctly', function (done) {
      fs.readFile(__dirname + '/zhaopinresume.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data
        });
        // console.log(resume);
        expect(resume.name).to.equal('李阳');
        done(err);
      });
    });

    it('should parse zhaopin another resume correctly', function (done) {
      fs.readFile(__dirname + '/zhaopinresume3.html', 'utf-8', function (err, data) {
        var resume = resumeParser.parse({
          html: data
        });
//                expect(resume.projectExperience).to.have.length(8);
        //console.log(resume);
        done(err);
      });
    });
  });
});