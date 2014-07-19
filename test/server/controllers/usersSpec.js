'use strict';

var expect = require('chai').expect,
  helper = require('../testHelper'),
  mongoose = require('mongoose'),
  Factory = require('./../factory'),
  User = mongoose.model('User'),
  Position = mongoose.model('Position');

describe('users', function () {
  var request, existUser, existPosition, position2;

  beforeEach(function (done) {
    helper.clearCollections('User', 'Company', 'Role', 'Position', function () {
      helper.login(function (agent, user) {
        existUser = user;
        request = agent;
        helper.createPosition({name: 'sales', company: user.company, owners: [user]}, function (err, position) {
          existPosition = position;
          expect(position.owners).to.have.length(1);
          helper.createPosition({name: 'cfo', company: user.company}, function (err, p2) {
            expect(p2.owners).to.have.length(0);
            position2 = p2;
            done();
          });
        });
      });
    });
  });

  describe('POST /api/users', function () {
    it('should return 200 with json result', function (done) {
      Factory.build('role', {company: existUser.company}, function (createdRole) {
        request.post('/api/users')
          .send({
            name: 'for test create',
            email: 'fortest@create.com',
            password: 'password',
            title: 'ceo',
            role: createdRole._id,
            positions: [existPosition._id]
          }).expect(200, function () {
            User.findOne({title: 'ceo'}, function (err, u) {
              expect(u.positions).to.have.length(1);
              Position.findOne({name: 'sales', company: u.company}, function (err, p) {
                expect(p.owners).to.have.length(2);
                done();
              });
            });
          });
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

    it('should return 200 with only specific fields', function (done) {
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
          User.findOne({_id: existUser._id}, function (err, u) {
            expect(u.deleted).to.be.true;
            Position.findOne({_id: existPosition._id}, function (err, p) {
              expect(p.owners).to.have.length(0);
            });
            expect(err).to.not.exist;
            done();
          });
        });
    });
  });

  describe('put /api/users/:id', function () {
    it('should update the user and positions', function (done) {
      request.put('/api/users/' + existUser._id)
        .send({name: 'mark', positions: [position2._id] })
        .expect(200)
        .end(function (err) {
          expect(err).to.not.exist;
          User.findOne({_id: existUser._id}, function (err, u) {
            expect(u.name).to.equal('mark');
            expect(u.positions).to.have.length(1);
            expect(u.positions[0]).to.deep.equal(position2._id);
            Position.find({_id: {$in: u.positions}}, function (err, positions) {
              expect(err).to.not.exist;
              expect(positions).to.have.length(1);
              expect(positions[0].owners[0]).to.deep.equal(existUser._id);
              expect(positions[0]._id).to.deep.equal(position2._id);
              Position.findOne({_id: existPosition._id}, function (err, p) {
                expect(p.owners).to.have.length(0);
                done();
              });
            });
          });
        });
    });
  });
})
;