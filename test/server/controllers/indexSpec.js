'use strict';

var app = require('../../../server'),
  request = require('supertest'),
  helper = require('../testHelper');

describe('/', function () {

  describe('GET /', function () {
    it('should return 200 with html result', function (done) {
      request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /html/)
        .expect(/html/, done);
    });
  });

  describe('GET /others', function () {
    it('should return 404 with html result', function (done) {
      request(app)
        .get('/others')
        .expect(404)
        .expect('Content-Type', /html/, done);
    });
  });

  describe('GET /api/nothingshouldcalledthisname', function () {
    it('should return 404 when call /api/nothing', function (done) {
      helper.clearCollections('User', 'Company', function () {
        helper.login(function (agent) {
          setTimeout(function () {
            agent.get('/api/nothingshouldcalledthisname')
              .expect(404, done);
          }, 50);
        });
      });
    });
  });

  describe('GET /api/* without authentication', function () {
    it('should return 401', function (done) {
      request(app)
        .get('/api/something')
        .expect(401,done);
    });
  });
});