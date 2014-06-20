'use strict';

var expect = require('chai').expect,
  Factory = require('../factory'),
  helper = require('../testHelper');

describe('/sysAdminApi/companies', function () {
  var request, company;

  beforeEach(function (done) {
    helper.clearCollections('Company', 'User', 'Role', function () {
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
                company = createdCompany;
                request = agent;
                done();
              });
            });
        });
      });
    });
  });

  describe('GET /sysAdminApi/companies', function () {
    it('should return 200 with json result', function (done) {
      request.get('/sysAdminApi/companies')
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          company = res.body[0];
          expect(res.body).to.have.length(1);
          done(err);
        });
    });
  });

  describe('GET /sysAdminApi/companies/:id', function () {
    it('should return 200 with json result', function (done) {
      request.get('/sysAdminApi/companies/' + company.id)
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
