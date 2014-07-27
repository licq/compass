var helper = require('../testHelper'),
  Factory = require('../factory'),
  moment = require('moment'),
  expect = require('chai').expect;

describe('interviewReports', function () {
  var request;

  beforeEach(function (done) {
    helper.clearCollections('Company', 'User', 'Interview', 'Resume', function () {
      helper.login(function (agent, user) {
        Factory.create('resume', function (resume) {
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
          }, function () {
            done();
          });
        });
      });
    });
  });

  describe('get /api/interviewReports/counts', function () {
    it('should get the counts', function (done) {
      request.get('/api/interviewReports/counts?applyPosition=&reportType=day')
        .expect(200)
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

    it.skip('should return array of interviewcount of type week', function (done) {
      request.get('/api/interviewReports/counts?reportType=week')
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

    it('should return array of interviewcount of type months', function (done) {
      request.get('/api/interviewReports/counts?reportType=month')
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

  describe('get /api/interviewReports/summaries', function () {
    it('should return summaries', function (done) {
      request.get('/api/interviewReports/summaries?groupBy=status&groupBy=applyPosition')
        .expect(200)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.deep.equal({
            applyPosition: [
              {name: '销售总监', count: 1}
            ],
            status: [
              {name: 'new', count: 1}
            ]});
          done();
        });
    });
  });
});