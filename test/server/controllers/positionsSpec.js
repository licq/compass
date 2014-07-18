'use strict';

var
  expect = require('chai').expect,
  helper = require('../testHelper'),
  mongoose = require('mongoose'),
  Factory = require('./../factory'),
  User = mongoose.model('User'),
  Position = mongoose.model('Position');
describe('positions', function () {
  var request, existPosition, existUser, user2;

  beforeEach(function (done) {
    helper.clearCollections('User', 'Company', 'Position', function () {
      helper.login(function (agent, user) {
        existUser = user;
        request = agent;
        Factory.create('user', {company: existUser.company}, function (u2) {
          user2 = u2;
          Factory.build('position', {company: existUser.company, owners: [existUser._id]}, function (p) {
            Position.createPosition(p, function (err, position) {
              existPosition = position;
              done();
            });
          });
        });
      });
    });
  });

  describe('GET /api/positions', function () {
    it('should return 200 with json result', function (done) {
      request.get('/api/positions')
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(res.body).to.have.length(1);
          var r = res.body[0];
          expect(r).to.have.property('name');
          done(err);
        });
    });

  });

  describe('GET /api/positions/:id', function () {
    it('should return 200 with json result', function (done) {
      request.get('/api/positions/' + existPosition._id)
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res.body.name).to.equal(existPosition.name);
          done();
        });
    });
  });

  describe('post /api/positions', function () {
    it('should create new position', function (done) {
      request.post('/api/positions')
        .send({
          name: 'cio',
          department: '技术部',
          owners: [existUser._id],
          evaluationCriterions: [
            {
              'name': '主动性',
              'rate': 0.5
            },
            {
              'name': '工作能力',
              'rate': 1
            }
          ]})
        .expect(200, function () {
          Position.find({company: existUser.company}, function (err, positions) {
            expect(positions).to.have.length(2);
            User.find({_id: existUser._id}, function (err, users) {
              expect(err).to.not.exist;
              expect(users).to.have.length(1);
              expect(users[0].positions).to.have.length(2);
              done();
            });
          });
        });
    });
  });

  describe('put /api/positions/:id', function () {
    it('should update position', function (done) {
      request.put('/api/positions/' + existPosition._id)
        .send({owners: [user2._id], name: 'cto' })
        .expect(200)
        .end(function (err) {
          expect(err).to.not.exist;
          Position.findOne({_id: existPosition._id}, function (err, position) {
            expect(position.name).to.equal('cto');
            expect(position.owners).to.have.length(1);
            User.find({_id: {$in: position.owners}}, function (err, users) {
              expect(err).to.not.exist;
              expect(users[0].positions[0]).to.deep.equal(position._id);
              expect(users[0]._id).to.deep.equal(user2._id);
              done();
            });
          });
        });
    });
  });

  describe('DELETE /api/positions/:id', function () {
    it('should return 200', function (done) {
      request.del('/api/positions/' + existPosition._id)
        .expect(200)
        .end(function (err) {
          expect(err).to.not.exist;
          Position.findOne({_id: existPosition._id}, function (err, p) {
            expect(err).to.not.exist;
            expect(p).to.not.exist;
            User.findOne({_id: existUser._id}, function (err, u) {
              expect(err).to.not.exist;
              expect(u.positions).to.have.length(0);
            });
            done();
          });
        });
    });
  });
});

