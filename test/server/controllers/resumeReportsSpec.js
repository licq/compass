var helper = require('../testHelper'),
  Factory = require('../factory'),
  expect = require('chai').expect;

describe('resumeReports', function () {
  var request;

  beforeEach(function (done) {
    helper.clearCollections('User', 'Company', 'Mail', 'Resume', function () {
      helper.login(function (agent, user) {
        request = agent;
        Factory.create('resume', {company: user.company}, function () {
          done();
        });
      });
    });
  });

  describe('get /api/resumeReports/counts', function () {
    it('should return array of resumecount', function (done) {
      request.get('/api/resumeReports/counts')
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.have.length(1);
          done();
        });
    });
  });
});