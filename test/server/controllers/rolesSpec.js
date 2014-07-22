'use strict';

var
  expect = require('chai').expect,
  helper = require('../testHelper'),
  mongoose = require('mongoose'),
  Factory = require('./../factory'),
  Role = mongoose.model('Role');
describe('roles', function () {
  var request, existRole, existUser;

  beforeEach(function (done) {
    helper.clearCollections('User', 'Company', 'Role', function () {
      helper.login(function (agent, user) {
        existUser = user;
        request = agent;
        Role.findOne({_id: existUser.role}).exec(function (err, role) {
          existRole = role;
          done();
        });
      });
    });
  });

  describe('GET /api/roles', function () {
    it('should return 200 with json result', function (done) {
      request.get('/api/roles')
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(res.body).to.have.length(1);
          var r = res.body[0];
          expect(r).to.have.property('company');
          expect(r).to.have.property('name');
          expect(r).to.have.property('permissions');
          done(err);
        });
    });
  });

  describe('GET /api/roles/:id', function () {
    it('should return 200 with json result', function (done) {
      request.get('/api/roles/' + existRole._id)
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res.body.name).to.equal(existRole.name);
          done();
        });
    });
  });

  describe('post /api/roles', function () {
    it('should create new role', function (done) {
      request.post('/api/roles')
        .send({
          name: 'guest',
          permissions: []
        })
        .expect(200, function () {
          Role.find({company: existUser.company}, function (err, roles) {
            expect(roles).to.have.length(2);
            done();
          });
        });
    });
  });

  describe('put /api/roles/:id', function () {
    it('should update role', function (done) {
      request.put('/api/roles/' + existRole._id)
        .send({
          name: 'guest',
          permissions: ['viewResumeList']
        }).expect(200)
        .end(function (err) {
          expect(err).to.not.exist;
          Role.findOne({_id: existRole._id}, function (err, role) {
            expect(role.name).to.equal('guest');
            expect(role.permissions[0]).to.deep.equal('viewResumeList');
            done();
          });
        });
    });
  });

  describe('DELETE /api/roles/:id', function () {
    it('should return 200', function (done) {
      Factory.create('role', {company: existUser.company}, function (role2) {
        request.del('/api/roles/' + role2._id)
          .expect(200)
          .end(function (err) {
            expect(err).to.not.exist;
            Role.findOne({_id: role2._id}, function (err, r2) {
              expect(r2).to.not.exist;
              done();
            });
          });
      });
    });
    it('should return 400 when the role is associated with some users', function (done) {
      request.del('/api/roles/' + existRole._id)
        .expect(400)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(res.body.message).to.exist;
          expect(res.body.message).to.be.equal('还有1个用户属于' + existRole.name + '这个角色,不能删除');
          done();
        });
    });
    it.skip('should return 200 when the role is associated with deleted users', function (done) {
      existUser.deleted = true;
      existUser.save(function () {
        request.del('/api/roles/' + existRole._id)
          .expect(200)
          .end(function (err) {
            expect(err).to.not.exist;
            Role.findById(existRole.id, function (err, role) {
              expect(err).to.not.exist;
              expect(role).to.not.exist;
              done();
            });
          });
      });
    });
  });
});

