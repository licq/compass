'use strict';

var app = require('../../../server'),
  request = require('supertest'),
  helper = require('../testHelper'),
  Factory = require('../factory');


describe('singups', function () {
  beforeEach(function (done) {
    helper.clearCollections('User', 'Company', 'Role','Signup', done);
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
          .expect(200, done);
      });
    });
  });
});