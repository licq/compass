var
  mongoose = require('mongoose'),
  Resume = mongoose.model('Resume'),
  User = mongoose.model('User'),
  helper = require('../testHelper'),
  expect = require('chai').expect,
  moment = require('moment'),
  Factory = require('../factory');

describe('Resume', function () {
  beforeEach(function (done) {
    helper.clearCollections(Resume, 'Company', 'ApplicationSetting', function () {
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
        birthday: birthday,
        name: 'zhangsan',
        email: 'zhangsan@zhangsan.com',
        mobile: '13838383838'
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

    describe('remove resumes from same person', function () {
      var resumeData;
      beforeEach(function (done) {
        var birthday = new Date();
        birthday.setFullYear(birthday.getFullYear() - 20);
        Factory.create('mail', {company: company}, function (mail) {
          resumeData = {
            applyPosition: 'cio',
            educationHistory: [
              {
                degree: 'associate'
              }
            ],
            birthday: birthday,
            mail: mail._id,
            company: company,
            name: resume.name,
            email: resume.email,
            mobile: resume.mobile
          };
          done();
        });
      });

      it('should set the new resume status to archive if there is a resume from the same person exist and the company does not allow duplication', function (done) {
        mongoose.model('ApplicationSetting').create({company: company, filterSamePerson: 999}, function (err) {
          expect(err).to.not.exist;
          Resume.createOrUpdateAndIndex(resumeData, function (err, newResume) {
            expect(err).to.not.exist;
            expect(newResume.id).to.not.equal(resume.id);
            expect(newResume.status).to.equal('duplicate');
            done();
          });
        });
      });

      it('should set the new resume status to archive if there is a resume from the same person exist within 3 months and the company does not allow duplication in 3 months', function (done) {
        resume.createdAt = moment().subtract(2,'M').toDate();
        resume.save(function (err) {
          expect(err).to.not.exist;
          mongoose.model('ApplicationSetting').create({company: company, filterSamePerson: 3}, function (err) {
            expect(err).to.not.exist;
            Resume.createOrUpdateAndIndex(resumeData, function (err, newResume) {
              expect(err).to.not.exist;
              expect(newResume.id).to.not.equal(resume.id);
              expect(newResume.status).to.equal('duplicate');
              done();
            });
          });
        });
      });

      it('should set the new resume status to new if there is a resume from the same person exist before 3 months and the company does not allow duplication in 3 months', function (done) {
        resume.createdAt = moment().add('months', -4).toDate();
        resume.save(function (err) {
          expect(err).to.not.exist;
          mongoose.model('ApplicationSetting').create({company: company, filterSamePerson: 3}, function (err) {
            expect(err).to.not.exist;
            Resume.createOrUpdateAndIndex(resumeData, function (err, newResume) {
              expect(err).to.not.exist;
              expect(newResume.id).to.not.equal(resume.id);
              expect(newResume.status).to.equal('new');
              done();
            });
          });
        });
      });

      it('should set the new resume status to new if the company does allow duplication', function (done) {
        resume.createdAt = moment().add('months', -1).toDate();
        resume.save(function (err) {
          expect(err).to.not.exist;
          mongoose.model('ApplicationSetting').create({company: company, filterSamePerson: 0}, function (err) {
            expect(err).to.not.exist;
            Resume.createOrUpdateAndIndex(resumeData, function (err, newResume) {
              expect(err).to.not.exist;
              expect(newResume.id).to.not.equal(resume.id);
              expect(newResume.status).to.equal('new');
              done();
            });
          });
        });
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

    describe('using positions filter', function () {
      var user, position;
      beforeEach(function (done) {
        helper.clearCollections('User', 'Position', function () {
          done();
        });
      });

      it('should return one result when user has associated positions', function (done) {
        helper.createPosition({company: resume.company, name: '销售主管', toCreateUser: true}, function (err, createdPosition, createdUser) {
          position = createdPosition;
          user = createdUser;
          User.findOne({_id: user._id}).populate('positions', 'name').exec(function (err, u) {
            Resume.query({positions: u.positions}, function (err, results) {
              expect(results.hits.total).to.equal(1);
              done(err);
            });
          });
        });
      });

      it('should return one result when user has no associated positions', function (done) {
        helper.createPosition({company: resume.company, name: '销售主管', toCreateUser: true}, function (err, createdPosition, createdUser) {
          position = createdPosition;
          user = createdUser;
          User.findOne({_id: user._id}).populate('positions', 'name').exec(function (err, u) {
            Resume.query({positions: u.positions}, function (err, results) {
              expect(results.hits.total).to.equal(1);
              done(err);
            });
          });
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
}) ;
