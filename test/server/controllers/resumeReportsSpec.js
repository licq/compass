var helper = require('../testHelper'),
  Factory = require('../factory'),
  moment = require('moment'),
  expect = require('chai').expect;

describe('resumeReports', function () {
  var request;

  beforeEach(function (done) {
    helper.clearCollections('User', 'Company', 'Mail', 'Resume', function () {
      helper.login(function (agent, user) {
        request = agent;
        Factory.create('resume', {company: user.company, applyPosition: '市场总监', channel: '智联招聘'}, function () {
          done();
        });
      });
    });
  });

  describe('get /api/resumeReports/counts', function () {
    it('should return array of resumecount', function (done) {
      request.get('/api/resumeReports/counts?reportType=day')
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.have.length(1);
          expect(res.body[0]).to.deep.equal({
            year: moment().year(),
            month: moment().month() + 1,
            day: moment().date(),
            count: 1
          });
          done();
        });
    });
    it('should return array of resumecount of type week', function (done) {
      request.get('/api/resumeReports/counts?reportType=week')
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.have.length(1);
          expect(res.body[0]).to.deep.equal({
            year: moment().year(),
            week: moment().isoWeek(),
            count: 1
          });
          done();
        });
    });
    it('should return array of resumecount of type months', function (done) {
      request.get('/api/resumeReports/counts?reportType=month')
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.have.length(1);
          expect(res.body[0]).to.deep.equal({
            year: moment().year(),
            month: moment().month() + 1,
            count: 1
          });
          done();
        });
    });
  });

  describe('get /api/resumeReports/applyPositions', function () {
    it('should return array of applyPositions', function (done) {
      request.get('/api/resumeReports/applyPositions')
        .expect(200)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.deep.equal(['市场总监']);
          done();
        });
    });
  });
  describe('get /api/resumeReports/channels', function () {
    it('should return array of channel', function (done) {
      request.get('/api/resumeReports/channels')
        .expect(200)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.deep.equal(['智联招聘']);
          done();
        });
    });
  });
});