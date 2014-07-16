'use strict';

var
  Position = require('mongoose').model('Position'),
  User = require('mongoose').model('User'),
  expect = require('chai').expect,
  Factory = require('../factory'),
  helper = require('../testHelper'),
  user, company;

describe('Position', function () {
  beforeEach(function (done) {
    helper.clearCollections('Company', 'Position', 'User', function () {
      Factory.create('company', function (createdCompany) {
        company = createdCompany;
        Factory.create('user', {company: company._id}, function (createdUser) {
          user = createdUser;
          done();
        });
      });
    });
  });

  describe('#validate', function () {
    it('should begin with no positions', function (done) {
      Position.find({}, function (err, positions) {
        expect(positions).to.be.empty;
        done();
      });
    });

    it('should be able to save without problems', function (done) {
      Factory.build('position', {company: company._id, owners: [user._id]}, function (position) {
        Position.createPosition(position, function (err) {
          expect(err).to.not.exist;
          User.find({_id: {$in: position.owners}}, function (err, users) {
            expect(err).to.not.exist;
            expect(users).to.have.length(1);
            expect(users[0].positions[0]).to.deep.equal(position._id);
            done(err);
          });
        });
      });
    });
  });

  it('should fail to save an existing position again', function (done) {
    Factory.create('position', function (position) {
      Factory.build('position', {name: position.name, company: position.company}, function (position2) {
        position2.save(function (err) {
          expect(err).to.exist;
          done();
        });
      });
    });
  });

  it('should show an error when try to save empty position', function (done) {
    return new Position().save(function (err) {
      expect(err).to.exist;
      expect(err.errors).to.have.property('name');
      expect(err.errors).to.have.property('company');
      done();
    });
  });


  describe('#attributes', function () {
    it('should have createdat and updatedat timestamp', function (done) {
      Factory.create('position', function (position) {
        expect(position.createdAt).to.exist;
        expect(position.updatedAt).to.exist;
        done();
      });
    });
  });

  describe('deletePosition', function () {
    it('should delete position and users', function (done) {
      Factory.build('position', {company: company._id, owners: [user._id]}, function (position) {
        Position.createPosition(position, function (err) {
          expect(err).to.not.exist;
          Position.deletePosition(position, function (err) {
            expect(err).to.not.exist;
            User.find({_id: {$in: position.owners}}, function (err, users) {
              expect(err).to.not.exist;
              expect(users).to.have.length(1);
              expect(users[0].positions).to.have.length(0);
              Position.findOne({_id: position._id}, function (err, p) {
                expect(err).to.not.exist;
                expect(p).to.not.exist;
                done(err);
              });
            });
          });
        });
      });

    });
  });

  describe('updatePosition', function () {
    it('should update position and users', function (done) {
      var user2;
      Factory.create('user', {company: company._id}, function (createdUser) {
        user2 = createdUser;
        Factory.build('position', {company: company._id, owners: [user._id]}, function (p) {
          Position.createPosition(p, function (err, position) {
            expect(err).to.not.exist;
            position.owners.push(user2._id);
            Position.updatePosition(position, function (err, updatedPosition) {
              expect(err).to.not.exist;
              expect(updatedPosition.owners).to.have.length(2);
              User.find({_id: {$in: updatedPosition.owners}}, function (err, users) {
                expect(err).to.not.exist;
                expect(users).to.have.length(2);
                done(err);
              });
            });
          });
        });
      });
    });
  });
});