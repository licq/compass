'use strict';

var helper = require('../testHelper'),
  Factory = require('../factory'),
  expect = require('chai').expect,
  moment = require('moment'),
  Interview = require('mongoose').model('Interview'),
  Resume = require('mongoose').model('Resume');

describe('interviews', function () {
  var user, resume, request, interview;

  beforeEach(function (done) {
    helper.clearCollections('Company', 'User', 'Role', 'Interview', 'Position', 'Resume', function () {
      helper.login(function (agent, createdUser) {
        Factory.create('resume', function (createdResume) {
          resume = createdResume;
          user = createdUser;
          request = agent;
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
      });
    });
  });

  describe('get /api/interviews/:id', function () {
    it('should return one interview', function (done) {
      request.get('/api/interviews/' + interview._id)
        .expect('Content-type', /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('_id');
          expect(res.body.events[0].interviewers[0]).to.have.property('name');
          done();
        });
    });
  });

  describe('when access is NOT controlled by positions the user owns', function () {

    beforeEach(function (done) {
      Factory.create('applicationSetting', {company: user.company}, function (setting) {
        expect(setting.positionRightControlled).to.be.false;
        helper.createPosition({owners: [user], company: user.company, name: '市场部经理'}, function () {
          done();
        });
      });
    });

    describe('get /api/interviews?status=new', function () {
      it('should return interview list with one item', function (done) {
        request.get('/api/interviews?status=new&page=1&pageSize=5')
          .expect(200)
          .expect('content-type', /json/)
          .end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.have.length(1);
            expect(res.get('totalCount')).to.equal('1');
            done();
          });
      });
    });

    describe('get /api/interviews/ with status offer accepted', function () {
      it('should get the interview list', function (done) {
        var startDate = moment().startOf('day').toISOString(),
          endDate = moment().endOf('day').toISOString();
        Factory.create('interview', {
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
          status: 'offer accepted'
        }, function () {
          request.get('/api/interviews?endDate=' + endDate + 'startDate=' + startDate + 'status=offer%20accpeted')
            .expect(200)
            .end(function (err, res) {
              expect(err).to.not.exist;
              expect(res.body).to.have.length(1);
              done();
            });
        });
      });
    });

    describe('get /api/interviews/ with status offered', function () {
      it('should get the interview list', function (done) {
        Factory.create('interview', {
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
          status: 'offered'
        }, function () {
          request.get('/api/interviews?status=offered')
            .expect(200)
            .end(function (err, res) {
              expect(err).to.not.exist;
              expect(res.body).to.have.length(1);
              done();
            });
        });
      });
    });

    describe('get /api/applyPositions?for=company', function () {
      it('should return one applyPosition', function (done) {
        request.get('/api/applyPositions?for=company')
          .expect(200)
          .expect('content-type', /json/)
          .end(function (err, res) {
            expect(res.body).to.deep.equal(['销售总监']);
            done(err);
          });
      });
    });

    describe('get /api/applyPositions', function () {
      it('should return one applyPosition', function (done) {
        request.get('/api/applyPositions')
          .expect(200)
          .expect('content-type', /json/)
          .end(function (err, res) {
            expect(res.body).to.deep.equal(['销售总监']);
            done(err);
          });
      });
    });

  });

  describe('when access IS controlled by positions the user owns', function () {

    beforeEach(function (done) {
      Factory.create('applicationSetting', {positionRightControlled: true, company: user.company}, function (setting) {
        expect(setting.positionRightControlled).to.be.true;
        helper.createPosition({owners: [user], company: user.company, name: '销售总监'}, function () {
          done();
        });
      });
    });

    describe('get /api/interviews?status=new', function () {
      it('should return interview list with one item', function (done) {
        request.get('/api/interviews?status=new&page=1&pageSize=5')
          .expect(200)
          .expect('content-type', /json/)
          .end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.have.length(1);
            expect(res.get('totalCount')).to.equal('1');
            done();
          });
      });
    });

    describe('get /api/interviews/ with status offer accepted', function () {
      it('should get the interview list', function (done) {
        var startDate = moment().startOf('day').toISOString(),
          endDate = moment().endOf('day').toISOString();
        Factory.create('interview', {
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
          status: 'offer accepted'
        }, function () {
          request.get('/api/interviews?endDate=' + endDate + 'startDate=' + startDate + 'status=offer%20accpeted')
            .expect(200)
            .end(function (err, res) {
              expect(err).to.not.exist;
              expect(res.body).to.have.length(1);
              done();
            });
        });
      });
    });

    describe('get /api/interviews/ with status offered', function () {
      it('should get the interview list', function (done) {
        Factory.create('interview', {
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
          status: 'offered'
        }, function () {
          request.get('/api/interviews?status=offered')
            .expect(200)
            .end(function (err, res) {
              expect(err).to.not.exist;
              expect(res.body).to.have.length(1);
              done();
            });
        });
      });
    });

    describe('get /api/applyPositions?for=company', function () {
      it('should return one applyPosition', function (done) {
        request.get('/api/applyPositions?for=company')
          .expect(200)
          .expect('content-type', /json/)
          .end(function (err, res) {
            expect(res.body).to.deep.equal(['销售总监']);
            done(err);
          });
      });
    });

    describe('get /api/applyPositions', function () {
      it('should return one applyPosition', function (done) {
        request.get('/api/applyPositions')
          .expect(200)
          .expect('content-type', /json/)
          .end(function (err, res) {
            expect(res.body).to.deep.equal(['销售总监']);
            done(err);
          });
      });
    });
  });

  describe('put /api/interview/:id with status offered', function () {
    it('should change the status', function (done) {
      request.put('/api/interviews/' + interview._id)
        .send({status: 'offered'})
        .expect(200, function () {
          Interview.findById(interview._id, function (err, newInterview) {
            expect(newInterview.status).to.equal('offered');
            expect(newInterview.statusBy.toString()).to.equal(user.id);
            done();
          });
        });
    });
  });

  describe('put /api/interview/:id with status rejected', function () {
    it('should change the status of the interview and the status of the resume', function (done) {
      request.put('/api/interviews/' + interview._id)
        .send({status: 'rejected'})
        .expect(200, function () {
          Interview.findById(interview._id, function (err, newInterview) {
            expect(newInterview.status).to.equal('rejected');
            expect(newInterview.statusBy.toString()).to.equal(user.id);
            Resume.findById(resume._id, function (err, newResume) {
              expect(newResume.status).to.equal('rejected');
              done(err);
            });
          });
        });
    });
  });

  describe('put /api/interview/:id with status offer rejected', function () {
    it('should change the status of the interview and the status of the resume', function (done) {
      request.put('/api/interviews/' + interview._id)
        .send({status: 'offer rejected',
          applierRejectedReason: 'money'})
        .expect(200, function () {
          Interview.findById(interview._id, function (err, newInterview) {
            expect(newInterview.status).to.equal('offer rejected');
            expect(newInterview.statusBy.toString()).to.equal(user.id);
            Resume.findById(resume._id, function (err, newResume) {
              expect(newResume.status).to.equal('offer rejected');
              done(err);
            });
          });
        });
    });
  });

  describe('put /api/interview/:id with status offer accepted', function () {
    it('should change the status of the interview and the status of the resume', function (done) {
      request.put('/api/interviews/' + interview._id)
        .send({status: 'offer accepted',
          onboardDate: new Date()})
        .expect(200, function () {
          Interview.findById(interview._id, function (err, newInterview) {
            expect(newInterview.status).to.equal('offer accepted');
            expect(newInterview.statusBy.toString()).to.equal(user.id);
            Resume.findById(resume._id, function (err, newResume) {
              expect(newResume.status).to.equal('offer accepted');
              done(err);
            });
          });
        });
    });
  });

  describe('put /api/interview/:id with status recruited', function () {
    it('should change the status of the interview and the status of the resume', function (done) {
      request.put('/api/interviews/' + interview._id)
        .send({status: 'recruited'})
        .expect(200, function () {
          Interview.findById(interview._id, function (err, newInterview) {
            expect(newInterview.status).to.equal('recruited');
            expect(newInterview.onboardDate).to.exist;
            expect(newInterview.statusBy.toString()).to.equal(user.id);
            Resume.findById(resume._id, function (err, newResume) {
              expect(newResume.status).to.equal('recruited');
              done(err);
            });
          });
        });
    });
  });

});