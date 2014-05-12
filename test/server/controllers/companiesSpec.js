'use strict';

var app = require('../../../server'),
  request = require('supertest'),
  expect = require('chai').expect,
  Factory = require('../factory'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Company = mongoose.model('Company'),
  helper = require('./helper'),
  databaseHelper = require('../databaseHelper');

describe('/api/companies', function () {
  var cookies, company;

  beforeEach(function (done) {
    databaseHelper.clearCollections(Company, User, function () {
      Factory.create('company', function (createdCompany) {
        Factory.create('user', {company: createdCompany}, function (user) {
          helper.login(user, function (cks) {
            company = createdCompany;
            cookies = cks;
            done();
          });
        });
      });
    });
  });

  describe('GET /api/companies', function () {
    it('should return 200 with json result', function (done) {
      var req = request(app).get('/api/companies');
      req.cookies = cookies;
      req.expect(200)
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
      var req = request(app).get('/api/companies/' + company.id);
      req.cookies = cookies;
      req.expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res.body.name).to.equal(company.name);
          done();
        });
    });
  });
});


