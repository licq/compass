'use strict';

var fs = require('fs'),
  resumeParser = require('../../../server/parsers/remoteResumeParser'),
  async = require('async'),
  mongoose = require('mongoose'),
  Resume = mongoose.model('Resume'),
  helper = require('../testHelper'),
  expect = require('chai').expect,
  logger = require('../../../server/config/winston').logger(),
  handleParseResume = require('../../../server/tasks/workers').handleParseResume;

describe('remoteResumeParser', function () {
  var emailSchema;
  beforeEach(function (done) {
    helper.clearCollections('Resume', 'Mail', done);
    emailSchema = new mongoose.Schema({
      subject: String,
      html: String,
      company: mongoose.Schema.Types.ObjectId,
      fromAddress: String,
      attachments: [
        {
          contentType: String,
          fileName: String,
          contentDisposition: String,
          contentId: String,
          transferEncoding: String,
          length: Number,
          generatedFileName: String,
          checksum: String,
          content: Buffer
        }
      ]
    });
  });

  describe('#parse', function () {
    it.only('should parse resume correctly', function (done) {
      this.timeout(0);
      fs.readFile(__dirname + '/51job63.html', function (err, data) {
        //console.log(data.toString());
        resumeParser.parse({
          attachments: [{
            content: new Buffer(data),
            fileName: '51job.html'
          }]
        }, function (err, resume) {
          if (resume) {
            // console.log(resume);
            Resume.createOrUpdateAndIndex(resume, function (err) {
              if (err) {
                console.log(err);
              }
              expect(resume.name).to.equal('许东东');
              expect(resume.email).to.equal('zxpxdd3202@sohu.com');
              expect(resume.mobile).to.equal('13805730593');
              expect(resume.yearsOfExperience).to.equal(10);
              done(err);
            });
          } else {
            done(err);
          }
        });
      });
    });

    it('should parse doc file from mail correctly', function (done) {
      this.timeout(0);
      var tempemail = mongoose.model('Tmail', emailSchema);
      tempemail.find({}, function (err, emails) {
        async.eachSeries(emails, function (email, callback) {
          email.mailId = email._id;
          email.title = email.subject;
          email.date = Date.now();
          handleParseResume({data: email}, function () {
            callback(err);
          });
        }, function (err) {
          done(err);
        });
      });
    });  });
});