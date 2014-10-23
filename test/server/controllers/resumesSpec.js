var
  Resume = require('mongoose').model('Resume'),
  Interview = require('mongoose').model('Interview'),
  helper = require('../testHelper'),
  Factory = require('../factory'),
  expect = require('chai').expect;

describe('#resumes', function () {
  var request, resume, user;

  beforeEach(function (done) {
    helper.clearCollections('User', 'Company', 'Role', 'Resume', 'Mail', 'Interview', function () {
      Resume.recreateIndex(function () {
        helper.login(function (agent, newUser) {
          user = newUser;
          request = agent;
          Factory.build('resume', {company: user.company, status: 'archived'}, function (newResume) {
            resume = newResume;
            resume.saveAndIndexSync(done);
          });
        });
      });
    });
  });

  it('should return all archived resumes', function (done) {
    request.get('/api/resumes')
      .expect(200)
      .expect('content-type', /json/)
      .end(function (err, res) {
        expect(res.body.hits.total).to.equal(1);
        expect(res.body.facets.applyPosition.terms).to.have.length(1);
        expect(res.body.facets.applyPosition.terms[0].term).to.equal('cio');
        expect(res.body.facets.applyPosition.terms[0].count).to.equal(1);
        expect(res.body.facets.highestDegree.terms).to.have.length(1);
        expect(res.body.facets.highestDegree.terms[0].term).to.equal('master');
        expect(res.body.facets.highestDegree.terms[0].count).to.equal(1);
        expect(res.body.facets.age.entries).to.have.length(1);
        expect(res.body.facets.age.entries[0].key).to.equal(0);
        expect(res.body.facets.age.entries[0].count).to.equal(1);
        done(err);
      });
  });

  describe('get /sysAdminApi/resumeCounts', function () {
    it('should return resumeCountInDb and resumeCountInEs', function (done) {
      Factory.create('company', {name: 'compasstest'}, function (createdCompany) {
        Factory.create('role', {name: '系统管理员', company: createdCompany._id, permissions: ['#systemSettings']}, function (createdRole) {
          Factory.create('user',
            {name: 'systemadmin',
              email: 'sysad@cpstest.com',
              password: 'test123',
              company: createdCompany._id,
              role: createdRole._id,
              title: 'system admin'}, function (sysAdmin) {
              helper.login(sysAdmin, function (agent) {
                request = agent;
                request.get('/sysAdminApi/resumeCounts')
                  .expect(200)
                  .end(function (err, res) {
                    expect(err).to.not.exist;
                    expect(res.body).to.have.property('resumeCountInDb', 1);
                    expect(res.body).to.have.property('resumeCountInEs', 1);
                    expect(res.body).to.have.property('mailCount', 1);
                    done();
                  });
              });
            });
        });
      });

    });
  });

  describe('get /api/resumes/:id', function () {
    var interview;

    beforeEach(function (done) {
      Factory.create('interview', {
        application: resume._id,
        company: user.company,
        applyPosition: '销售总监',
        events: [
          {
            startTime: new Date(),
            duration: 90,
            interviewers: [user._id],
            createdBy: user._id
          }
        ],
        status: 'new'
      }, function (createdInterview) {
        interview = createdInterview;
        done();
      });
    });

    it('should get resume with the interview', function (done) {
      request.get('/api/resumes/' + resume.id)
        .expect(200)
        .end(function (err, res) {
          expect(err).to.not.exist;
          var data = res.body;
          expect(data).to.have.property('name', resume.name);
          expect(data.interview).to.have.property('applyPosition', '销售总监');
          done();
        });
    });
  });

  describe('put /api/resumes/:id', function () {

    it('should reset resume to pursued status', function (done) {
      request.put('/api/resumes/' + resume.id)
        .expect(200)
        .end(function (err) {
          expect(err).to.not.exist;
          Resume.findById(resume._id, function (err, resume) {
            expect(err).to.not.exist;
            expect(resume.status).to.equal('pursued');
            Interview.findOne({application: resume._id}, function (err, interview) {
              expect(err).to.not.exist;
              expect(interview).to.not.exist;
              done();
            });
          });
        });
    });

    it('should reset resume to interview', function (done) {
      var rejectedResume;
      Factory.build('resume', {company: user.company, status: 'offer rejected'}, function (newResume) {
        rejectedResume = newResume;
        rejectedResume.saveAndIndexSync(function () {
          Factory.create('interview', {
            application: rejectedResume._id,
            company: user.company,
            applyPosition: '人力总监',
            events: [
              {
                startTime: new Date(),
                duration: 90,
                interviewers: [user._id],
                createdBy: user._id
              }
            ],
            status: 'offer rejected'
          }, function () {
            request.put('/api/resumes/' + rejectedResume.id)
              .expect(200)
              .end(function (err) {
                expect(err).to.not.exist;
                Resume.findById(rejectedResume._id, function (err, resume) {
                  expect(err).to.not.exist;
                  expect(resume.status).to.equal('interview');
                  Interview.findOne({application: rejectedResume._id}, function (err, interview) {
                    expect(err).to.not.exist;
                    expect(interview.status).to.equal('new');
                    done();
                  });
                });
              });
          });

        });
      });
    });
  });
});