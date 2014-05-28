'use strict';

var
  expect = require('chai').expect,
  Factory = require('../factory'),
  helper = require('../testHelper');


describe('/api/mails', function () {
  var request, mail;

  before(function (done) {
    helper.clearCollections('User', 'Company', function () {
      helper.login(function (agent, user) {
        request = agent;
        Factory.create('mail', {company: user.company}, function (newMail) {
          mail = newMail;
          done();
        });
      });
    });
  });

  describe('GET /api/mails', function () {
    it('should return 200 with json result', function (done) {
      request.get('/api/mails?currentPage=1&pageSize=5')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res.get('totalCount')).to.equal('1');
          expect(res.body).to.have.length(1);
          done();
        });
    });
  });

  describe('GET /api/mails/:mailId', function () {
    it('should return 200 with json result', function (done) {
      request.get('/api/mails/' + mail.id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(mail._id.equals(res.body._id)).to.be.true;
          done();
        });
    });
  });
});


