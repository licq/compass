'use strict';

var expect = require('chai').expect,
  Resume = require('mongoose').model('Resume'),
  Factory = require('../factory'),
  helper = require('../testHelper');


describe('applications', function () {
  var request, user, resume;

  beforeEach(function (done) {
    helper.clearCollections('User', 'Company', 'Resume', 'Role', function () {
      helper.login(function (agent, u) {
        request = agent;
        user = u;
        Factory.build('resume', {applyPosition: '财务总监', company: user.company}, function (newResume) {
          newResume.saveAndIndexSync(function () {
            resume = newResume;
            done();
          });
        });
      });
    });
  });

  describe('GET /api/applications?status=new&pageSize=10&page=1', function () {
    it('should return 200 with json result', function (done) {
      request
        .get('/api/applications?status=new&pageSize=10&page=1')
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          var result = res.body;
          expect(result.hits.total).to.equal(1);
          expect(result.hits.hits).to.have.length(1);
          expect(result.facets.age).to.exist;
          expect(result.facets.highestDegree).to.exist;
          expect(result.facets.applyPosition).to.exist;
          done(err);
        });
    });

    it('should return 200 with json result when access NOT controlled by user owned positions', function (done) {
      Factory.create('applicationSetting', {company: user.company}, function (setting) {
        expect(setting.positionRightControlled).to.be.false;
        request
          .get('/api/applications?status=new&pageSize=10&page=1&applyPosition=财务总监')
          .expect(200)
          .expect('content-type', /json/)
          .end(function (err, res) {
            var result = res.body;
            expect(result.hits.total).to.equal(1);
            expect(result.hits.hits).to.have.length(1);
            expect(result.facets.age).to.exist;
            expect(result.facets.highestDegree).to.exist;
            expect(result.facets.applyPosition).to.exist;
            done(err);
          });
      });
    });

    it('should return 200 with json result when access is controlled by user owned positions', function (done) {
      Factory.create('applicationSetting', {positionRightControlled: true, company: user.company}, function (setting) {
        expect(setting.positionRightControlled).to.be.true;
        request
          .get('/api/applications?status=new&pageSize=10&page=1')
          .expect(200)
          .expect('content-type', /json/)
          .end(function (err, res) {
            var result = res.body;
            expect(result.hits.total).to.equal(0);
            expect(result.hits.hits).to.have.length(0);
            expect(result.facets.age).to.exist;
            expect(result.facets.highestDegree).to.exist;
            expect(result.facets.applyPosition).to.exist;
            done(err);
          });
      });
    });
  });

  describe('GET /api/applications/:id', function () {
    it('should return a resume', function (done) {
      request.get('/api/applications/' + resume._id)
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(res.body).to.have.property('_id');
          done(err);
        });
    });
  });

  describe('PUT /api/applications/:id', function () {
    it('should set status to archived', function (done) {
      request.put('/api/applications/' + resume._id + '?status=archived')
        .expect(200)
        .end(function (err) {
          expect(err).to.not.exist;
          Resume.findById(resume._id, function (err, resume) {
            expect(err).to.not.exist;
            expect(resume.status).to.equal('archived');
            done();
          });
        });
    });
    it('should set status to pursued', function (done) {
      request.put('/api/applications/' + resume._id + '?status=pursued')
        .expect(200)
        .end(function (err) {
          expect(err).to.not.exist;
          Resume.findById(resume._id, function (err, resume) {
            expect(err).to.not.exist;
            expect(resume.status).to.equal('pursued');
            done();
          });
        });
    });

    it('should set status to undetermined', function (done) {
      request.put('/api/applications/' + resume._id + '?status=undetermined')
        .expect(200)
        .end(function (err) {
          expect(err).to.not.exist;
          Resume.findById(resume._id, function (err, resume) {
            expect(err).to.not.exist;
            expect(resume.status).to.equal('undetermined');
            done();
          });
        });
    });

    it('should set status to archived', function (done) {
      request.put('/api/applications/' + resume._id + '?status=archived')
        .expect(200)
        .end(function (err) {
          expect(err).to.not.exist;
          Resume.findById(resume._id, function (err, resume) {
            expect(err).to.not.exist;
            expect(resume.status).to.equal('archived');
            done();
          });
        });
    });

  });
});