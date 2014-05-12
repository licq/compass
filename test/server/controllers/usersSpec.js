'use strict';

var app = require('../../../server'),
  request = require('supertest'),
  mongoose = require('mongoose'),
  expect = require('chai').expect,
  User = mongoose.model('User'),
  Company = mongoose.model('Company'),
  Factory = require('../factory'),
  helper = require('./helper'),
  databaseHelper = require('../databaseHelper');


describe('users', function () {
  var cookies;
  var existUser;

  beforeEach(function (done) {
    databaseHelper.clearCollections(User, Company, function () {
      Factory.create('user', function (user) {
        existUser = user;
        helper.login(user, function (cks) {
          cookies = cks;
          done();
        });
      });
    });
  });

  describe('POST /api/users', function () {
    it('should return 200 with json result', function (done) {
      var req = request(app).post('/api/users');
      req.cookies = cookies;
      req.send({
        name: 'for test create',
        email: 'fortest@create.com',
        password: 'password',
        title: 'ceo'
      }).expect(200)
        .end(function (err) {
          done(err);
        });
    });
  });

  describe('GET /api/users', function () {
    it('should return 200 with json result', function (done) {
      var req = request(app).get('/api/users');
      req.cookies = cookies;
      req.expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(res.body).to.have.length(1);
          var u = res.body[0];
          expect(u).to.have.property('company');
          expect(u).to.have.property('title');
          expect(u).to.not.have.property('hashed_password');
          expect(u).to.not.have.property('salt');
          expect(u).to.not.have.property('provider');
          done(err);
        });
    });

    it('should not return deleted users', function (done) {
      Factory.create('user', {deleted: true}, function () {
        var req = request(app).get('/api/users');
        req.cookies = cookies;
        req.expect(200)
          .end(function (err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.have.length(1);
            done();
          });
      });
    });
  });

  describe('GET /api/users/:id', function () {
    it('should return 200 with json result', function (done) {
      var req = request(app).get('/api/users/' + existUser._id);
      req.cookies = cookies;
      req.expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res.body.name).to.equal(existUser.name);
          done();
        });
    });
  });

  describe('DELETE /api/users/:id', function () {
    it('should return 200', function (done) {
      var req = request(app).del('/api/users/' + existUser._id);
      req.cookies = cookies;
      req.expect(200)
        .end(function (err) {
          expect(err).to.not.exist;
          done();
        });
    });
  });

  describe('GET /api/users?fields=name', function () {
    it('should return 200 with json result', function (done) {
      var req = request(app).get('/api/users?fields=name');
      req.cookies = cookies;
      req.expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(err).to.not.exist;
          var u = res.body[0];
          expect(u).to.have.property('name');
          expect(u).to.have.property('_id');
          expect(u).to.not.have.property('company');
          expect(u).to.not.have.property('title');
          done();
        });
    });
  });


});


