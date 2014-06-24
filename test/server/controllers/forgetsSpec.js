'use strict';

var mongoose = require('mongoose'),
  app = require('../../../server'),
  request = require('supertest'),
  helper = require('../testHelper'),
  Factory = require('../factory'),
  expect = require('chai').expect,
  User = mongoose.model('User');


describe('forgot', function () {

  beforeEach(function (done) {
    helper.clearCollections('User', 'Company', 'Role', 'Token', 'EventSetting', done);
  });

  describe('POST /publicApi/forgot', function () {
    it('should return 200 with json result', function (done) {
      Factory.create('user', {email: 'test@compass.com'}, function (user) {
        request(app)
          .post('/publicApi/forgot')
          .send({email: user.email})
          .expect(200)
          .end(done);
      });
    });
  });

  describe('PUT /publicApi/forgot', function () {
    it('should return 200 with json result', function (done) {
      Factory.create('user', {email: 'test@compass.com', token: '778899'}, function () {
        request(app)
          .put('/publicApi/forgot')
          .send({token: '778899', password: '123456'})
          .expect(200, function (err) {
            expect(err).to.not.exist;
            User.findOne({token: '778800'}, function (err, user) {
              expect(user).to.not.exist;
              done(err);
            });
          });
      });
    });
  });
});