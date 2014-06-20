var app = require('../../../server'),
  request = require('supertest'),
  expect = require('chai').expect;

describe('captchas', function () {
  describe('GET /publicApi/captchas', function () {
    it('should generate file and put the key in the session', function (done) {
      request(app)
        .get('/publicApi/captchas')
        .expect(200)
        .expect('Content-Type', /jpeg/)
        .end(function (err) {
          expect(err).to.not.exist;
          done();
        });
    });
  });

  describe('PUT /publicApi/captchas', function () {
    it.skip('should return 400 if the captcha not same', function (done) {
      request(app)
        .put('/publicApi/captchas')
        .send({captcha: 'aabbcc'})
        .expect(400, done);
    });
  });
});