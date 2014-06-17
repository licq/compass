'use strict';

var mongoose = require('mongoose');
var app = require('../../../server'),
  request = require('supertest'),
  helper = require('../testHelper'),
  Factory = require('../factory'),
  expect = require('chai').expect,
  Role = mongoose.model('Role'),
  User = mongoose.model('User'),
  Company = mongoose.model('Company');


describe('singups', function () {
  beforeEach(function (done) {
    helper.clearCollections('User', 'Company', 'Role', 'Signup', done);
  });

  describe('POST /api/signups', function () {
    it('should return 200 with json result', function (done) {
      Factory.build('signup', {adminEmail: 'lee.chaoqun@icloud1.com'}, function (signup) {
        request(app)
          .post('/publicApi/signups')
          .send(signup)
          .expect(200)
          .expect('Content-Type', /json/, done);
      });
    });
  });

  describe('PUT /api/signups/:id', function () {
    it('should create company and user', function (done) {
      Factory.create('signup', function (signup) {
        request(app)
          .put('/publicApi/signups/' + signup._id)
          .expect(200, function (err) {
            expect(err).to.not.exist;
            Company.findOne({name: signup.companyName}, function (err, company) {
              expect(err).to.not.exist;
              expect(company).to.exist;
              Role.findOne({company: company._id, name: '管理员'}, function (err, role) {
                expect(err).to.not.exist;
                expect(role).to.exist;
                User.findOne({role: role._id}, function (err, user) {
                  expect(err).to.not.exist;
                  expect(user).to.exist;
                  done();
                });
              });
            });
          });
      });
    });
  });
});