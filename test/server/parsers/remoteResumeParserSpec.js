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

describe.skip('remoteResumeParser', function () {
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
    it('should parse resume correctly', function (done) {
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
      var tempemail = mongoose.model('Servermail', emailSchema);

      var stream = tempemail.find({}).select('html subject company fromAddress date attachments').stream();
      var index = 0, c = 0;

      stream.on('data', function (mail) {
        index += 1;
        //if ((index & 0x1F) === 0) {
        //    stream.pause();
        //    console.log('stream pauses');
        //    setTimeout(function () {
        //        streamResumeTimeout(stream);
        //    }, 30000);
        //}
        //jobs.addParseResumeJob(mail, function () {
        logger.info('add ', index + 'th parse resume job');
        handleParseResume({data: mail}, function () {
          return 0;
        }, function (resume) {
          logger.info(index + 'th resume parsed resume');
          if (resume && resume.name && (resume.mobile || resume.phone)) {
            c += 1;
            logger.info(c + 'th resume with name ' + resume.name);
          }


        });
        //});
      }).on('end', function () {
        logger.info('ended and added ', index, c, ' parse resume jobs');
      }).on('close', function () {
        logger.info('closed and totally added ', index, ' parse resume jobs');
        done();
      }).on('error', function () {
        logger.info('reparseMails error');
      });
    });
  });
});