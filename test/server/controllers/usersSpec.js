'use strict';

var
  expect = require('chai').expect,
  Factory = require('../factory'),
  helper = require('../testHelper');

describe('users', function () {
  var request, existUser;

  beforeEach(function (done) {
    helper.clearCollections('User', 'Company', 'Role',function () {
      helper.login(function (agent, user) {
        existUser = user;
        request = agent;
        done();
      });
    });
  });

  describe('POST /api/users', function () {
    it('should return 200 with json result', function (done) {
      Factory.build('role', {company: existUser.company}, function(createdRole){
        request.post('/api/users')
          .send({
            name: 'for test create',
            email: 'fortest@create.com',
            password: 'password',
            title: 'ceo',
            role: createdRole._id
          }).expect(200, done);

      });
    });
  });

  describe('GET /api/users', function () {
    it('should return 200 with json result', function (done) {
      request.get('/api/users')
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(res.body).to.have.length(1);
          var u = res.body[0];
          expect(u).to.have.property('company');
          expect(u).to.have.property('title');
          expect(u).to.have.property('role');
          expect(u).to.not.have.property('hashed_password');
          expect(u).to.not.have.property('salt');
          expect(u).to.not.have.property('provider');
          done(err);
        });
    });

    it('should not return deleted users', function (done) {
      Factory.create('user', {deleted: true}, function () {
        request.get('/api/users')
          .expect(200)
          .end(function (err, res) {
            expect(res.body).to.have.length(1);
            done(err);
          });
      });
    });
  });

  describe('GET /api/users/:id', function () {
    it('should return 200 with json result', function (done) {
      request.get('/api/users/' + existUser._id)
        .expect(200)
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
      request.del('/api/users/' + existUser._id)
        .expect(200)
        .end(function (err) {
          expect(err).to.not.exist;
          done();
        });
    });
  });

  describe('GET /api/users?fields=name', function () {
    it('should return 200 with json result', function (done) {
      request.get('/api/users?fields=name')
        .expect(200)
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