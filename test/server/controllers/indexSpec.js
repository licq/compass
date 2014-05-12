'use strict';

var app = require('../../../server'),
  request = require('supertest'),
  helper = require('../testHelper');

describe('/', function () {

  describe('GET /anything', function () {
    it('should return 200 with html result', function (done) {
      request(app)
        .get('/anything')
        .expect(200)
        .expect('Content-Type', /html/)
        .expect(/html/, done);
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
});