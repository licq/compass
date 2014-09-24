'use strict';

var
  Position = require('mongoose').model('Position'),
  Resume = require('mongoose').model('Resume'),
  Interview = require('mongoose').model('Interview'),
  User = require('mongoose').model('User'),
  Async = require('async'),
  expect = require('chai').expect,
  Factory = require('../factory'),
  helper = require('../testHelper'),
  user, company;

describe('Position', function () {
  beforeEach(function (done) {
    helper.clearCollections('Company', 'Position', 'Resume', 'Mail', 'Interview', 'User', function () {
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
      Factory.build('position', {company: company._id, owners: [user._id], aliases: [
        {name: 'p1'},
        {name: 'p2'}
      ]}, function (position) {
        Position.createPosition(position, function (err) {
          expect(err).to.not.exist;
          expect(position.aliases).to.have.length(2);
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
      helper.createPosition({company: company._id, owners: [user]}, function (err, position) {
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

  describe('test positions with aliases ', function () {
    var user2, position;
    beforeEach(function (done) {
      Factory.create('user', {company: company._id}, function (createdUser) {
        user2 = createdUser;
        Factory.build('position', {name: 'master', company: company._id, owners: [user._id], aliases: [
          {name: 'a1'},
          {name: 'a2'}
        ]}, function (p) {
          Position.createPosition(p, function (err, p) {
            position = p;
            expect(err).to.not.exist;
            expect(position.aliases).to.have.length(2);
            Resume.recreateIndex(function (err) {
              expect(err).to.not.exist;
              Async.times(5, function (n, next) {
                Factory.build('resume', {company: user.company, status: 'offer rejected', applyPosition: position.name}, function (resume) {
                  resume.saveAndIndexSync(function () {
                    Factory.create('interview', {
                      application: resume._id,
                      company: user.company,
                      applyPosition: position.name,
                      events: [
                        {
                          startTime: new Date(),
                          duration: 90,
                          interviewers: [user._id],
                          createdBy: user._id
                        }
                      ],
                      status: 'offered'
                    }, function () {
                      next();
                    });
                  });
                });
              }, function (err) {
                expect(err).to.not.exist;
                done();
              });
            });
          });
        });
      });
    });

    describe('createPosition with alias', function () {
      it('should createPosition and update resumes and interviews', function (done) {
        Factory.build('position', {name: 'anotherPosition', company: company._id, owners: [user._id], aliases: [
          {name: 'a1'},
          {name: 'master'}
        ]}, function (p) {
          Position.createPosition(p, function (err, anotherPosition) {
            expect(err).to.not.exist;
            User.find({_id: {$in: anotherPosition.owners}}, function (err, users) {
              expect(err).to.not.exist;
              expect(users).to.have.length(1);
              Resume.find({applyPosition: anotherPosition.name}, function (err, resumes) {
                expect(err).to.not.exist;
                expect(resumes).to.have.length(5);
                expect(resumes[0].applyPosition).to.equal('anotherPosition');
                Interview.find({applyPosition: anotherPosition.name}, function (err, interviews) {
                  expect(err).to.not.exist;
                  expect(interviews).to.have.length(5);
                  expect(interviews[0].applyPosition).to.equal('anotherPosition');
                  setTimeout(function () {
                    Resume.query({applyPosition: anotherPosition.name}, function (err, results) {
                      expect(err).to.not.exist;
                      expect(results.hits.total).to.equal(5);
                      expect(results.hits.hits[0].applyPosition).to.equal('anotherPosition');
                      done(err);
                    });
                  }, 1000);
                });
              });
            });
          });
        });
      });
    });

    describe('updatePosition', function () {
      it('should update position ,users, resumes and interviews', function (done) {
        position.owners.push(user2._id);
        position.aliases = [
          {name: position.name}
        ];
        position.name = 'newPosition';
        Position.updatePosition(position, function (err, updatedPosition) {
          expect(err).to.not.exist;
          expect(position.aliases).to.have.length(1);
          expect(updatedPosition.owners).to.have.length(2);
          User.find({_id: {$in: updatedPosition.owners}}, function (err, users) {
            expect(err).to.not.exist;
            expect(users).to.have.length(2);
            Resume.find({applyPosition: position.name}, function (err, resumes) {
              expect(err).to.not.exist;
              expect(resumes).to.have.length(5);
              expect(resumes[0].applyPosition).to.equal('newPosition');
              Interview.find({applyPosition: position.name}, function (err, interviews) {
                expect(err).to.not.exist;
                expect(interviews).to.have.length(5);
                expect(interviews[0].applyPosition).to.equal('newPosition');
                setTimeout(function () {
                  Resume.query({applyPosition: position.name}, function (err, results) {
                    expect(err).to.not.exist;
                    expect(results.hits.total).to.equal(5);
                    expect(results.hits.hits[0].applyPosition).to.equal('newPosition');
                    done(err);
                  });
                }, 1000);
              });
            });
          });
        });
      });
    });
  });
});