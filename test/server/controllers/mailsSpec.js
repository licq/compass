'use strict';

var app = require('../../../server'),
  request = require('supertest'),
  expect = require('chai').expect,
  Factory = require('../factory'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Company = mongoose.model('Company'),
  helper = require('./helper');


describe('/api/mails', function () {
  var cookies, mailId;

  before(function (done) {
    Company.remove().exec();
    User.remove().exec();

    Factory.create('user', function (user) {
      Factory.create('mail', {company: user.company}, function (mail) {
        mailId = mail._id;
        helper.login(user, function (cks) {
          cookies = cks;
          done();
        });
      });
    });
  });

  describe('GET /api/mails', function () {
    it('should return 200 with json result', function (done) {
      var req = request(app).get('/api/mails?page=1&pageSize=5');
      req.cookies = cookies;

      req.expect(200)
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
      var req = request(app).get('/api/mails/' + mailId);
      req.cookies = cookies;

      req.expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(mailId.equals(res.body._id)).to.be.true;
          done();
        });
    });
  });
});


