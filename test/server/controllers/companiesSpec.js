'use strict';

var expect = require('chai').expect,
  Factory = require('../factory'),
  helper = require('../testHelper');

describe('/api/companies', function () {
  var request, company;

  beforeEach(function (done) {
    helper.clearCollections('Company', 'User', function () {
      Factory.create('company', function (createdCompany) {
        Factory.create('user', {company: createdCompany}, function (user) {
          helper.login(user, function (agent) {
            company = createdCompany;
            request = agent;
            done();
          });
        });
      });
    });
  });

  describe('GET /api/companies', function () {
    it('should return 200 with json result', function (done) {
      request.get('/api/companies')
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          company = res.body[0];
          expect(res.body).to.have.length(1);
          done(err);
        });
    });
  });

  describe('GET /api/companies/:id', function () {
    it('should return 200 with json result', function (done) {
      request.get('/api/companies/' + company.id)
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res.body.name).to.equal(company.name);
          done();
        });
    });
  });
});
