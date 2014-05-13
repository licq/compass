var
  Resume = require('mongoose').model('Resume'),
  helper = require('../testHelper'),
  expect = require('chai').expect,
  Factory = require('../factory');

describe('Resume', function () {
  beforeEach(function (done) {
    helper.clearCollections(Resume, 'Company', function () {
      Resume.recreateIndex(function () {
        setTimeout(done, 500);
      });
    });
  });

  describe('elasticsearch', function () {
    it('should not have resume indexes in elasticsearch', function (done) {
      Resume.query({}, function (err, res) {
        expect(err).to.not.exist;
        expect(res.hits.total).to.equal(0);
        done();
      });
    });
  });

  describe('create', function () {
    var company, mailId, resume;
    beforeEach(function (done) {
      var birthday = new Date();
      birthday.setFullYear(birthday.getFullYear() - 20);
      Factory.build('resume', {
        applyPosition: '销售主管',
        educationHistory: [
          {
            degree: 'associate'
          }
        ],
        birthday: birthday
      }, function (newResume) {
        mailId = newResume.mail;
        newResume.saveAndIndexSync(function (err, createdResume) {
          company = newResume.company;
          resume = createdResume;
          done();
        });
      });
    });

    it('should update the resume parsed from the same mail', function (done) {
      var birthday = new Date();
      birthday.setFullYear(birthday.getFullYear() - 20);
      var resumeData = {
        applyPosition: 'cio',
        educationHistory: [
          {
            degree: 'associate'
          }
        ],
        birthday: birthday,
        mail: mailId,
        company: company
      };

      Resume.createOrUpdateAndIndex(resumeData, function (err, resumeInDb) {
        expect(resumeInDb.id).to.equal(resume.id);
        expect(resumeInDb.applyPosition).to.equal('cio');
        done();
      });
    });

    it('should index to elasticsearch', function (done) {
      Resume.query({}, function (err, res) {
        expect(err).to.not.exist;
        expect(res.hits.total).to.equal(1);
        expect(res.hits.hits[0].status).to.equal('new');
        done();
      });
    });

    it('should return 0 resumes when q not found', function (done) {
      Resume.query({company: company, q: '搜狐'}, function (err, results) {
        expect(results.hits.total).to.equal(0);
        done(err);
      });
    });

    it('should return one resumes if q found', function (done) {
      Resume.query({company: company, q: '阿里巴巴'}, function (err, results) {
        expect(results.hits.total).to.equal(1);
        done(err);
      });
    });

    describe('using highestDegree filter', function () {
      it('should return only one result if query for highestDegree=associate', function (done) {
        Resume.query({highestDegree: 'associate'}, function (err, results) {
          expect(results.hits.total).to.equal(1);
          done(err);
        });
      });

      it('should return no result if query for highestDegree=master', function (done) {
        Resume.query({highestDegree: 'master'}, function (err, results) {
          expect(results.hits.total).to.equal(0);
          done(err);
        });
      });
    });
    describe('using applyPosition filter', function () {
      it('should return only one result if query for applyPosition=销售主管', function (done) {
        Resume.query({applyPosition: '销售主管'}, function (err, results) {
          expect(results.hits.total).to.equal(1);
          done(err);
        });
      });

      it('should return no result if query for applyPosition=cio', function (done) {
        Resume.query({applyPosition: 'cio'}, function (err, results) {
          expect(results.hits.total).to.equal(0);
          done(err);
        });
      });
    });
    describe('using age filter', function () {
      it('should return only one result if query for age=[20,25]', function (done) {
        Resume.query({age: [20, 25]}, function (err, results) {
          expect(results.hits.total).to.equal(1);
          done(err);
        });
      });

      it('should return no result if query for age=30', function (done) {
        Resume.query({age: 30}, function (err, results) {
          expect(results.hits.total).to.equal(0);
          done(err);
        });
      });
    });
  });
})
;