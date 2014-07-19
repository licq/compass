'use strict';

var
  User = require('mongoose').model('User'),
  Position = require('mongoose').model('Position'),
  expect = require('chai').expect,
  Factory = require('../factory'),
  helper = require('../testHelper');

describe('User', function () {
  beforeEach(function (done) {
    helper.clearCollections('User', 'Company', 'Role', 'Position', 'ApplicationSetting', done);
  });

  describe('#validate', function () {
    it('should begin with no users', function (done) {
      User.find()
        .where('name').ne('systemadmin')
        .exec(function (err, users) {
          expect(users).to.be.empty;
          done();
        });
    });

    it('should be able to save without problems', function (done) {
      Factory.build('user', function (user) {
        user.save(function (err) {
          expect(user.deleted).to.be.false;
          done(err);
        });
      });
    });

    it('should create a user and update the position owners', function (done) {
      helper.createPosition(function (err, position) {
        expect(err).to.not.exist;
        Factory.build('user', {positions: position._id, company: position.company}, function (u) {
          User.createUser(u, function (err, user) {
            expect(err).to.not.exist;
            expect(user.positions[0]).to.deep.equal(position._id);
            User.count()
              .where('name').ne('systemadmin')
              .exec(function (err, count) {
                expect(count).to.be.equal(1);
                Position.findById(position._id, function (err, p) {
                  expect(p.owners[0]).to.deep.equal(user._id);
                  done(err);
                });
              });
          });
        });
      });
    });

    it('should delete user and ownership from positions', function (done) {
      helper.createPosition({toCreateUser: true}, function (err, position, createdUser) {
        expect(err).to.not.exist;
        User.deleteUser(createdUser, function (err, deletedUser) {
          expect(err).to.not.exist;
          User.findOne({_id: deletedUser._id}, function (err, u) {
            expect(err).to.not.exist;
            expect(u.deleted).to.be.true;
            Position.findOne({_id: position._id}, function (err, p) {
              expect(err).to.not.exist;
              expect(p.owners).to.have.length(0);
              done(err);
            });
          });
        });
      });
    });

    it('should update position and users', function (done) {
      helper.createPosition({toCreateUser: true}, function (err, position1, user) {
        helper.createPosition({company: user.company}, function (err, position2) {
          user.positions = [position2._id];
          User.updateUser(user, function () {
            User.findOne({_id: user._id}, function (err, u) {
              expect(u.positions[0]).to.deep.equal(position2._id);
              Position.findOne({_id: position1._id}, function (err, p1) {
                expect(p1.owners).to.have.length(0);
                Position.findOne({_id: position2._id}, function (err, p2) {
                  expect(p2.owners).to.have.length(1);
                  done(err);
                });
              });
            });
          });
        });
      });
    });

    it('should fail to save an existing user again', function (done) {
      Factory.create('user', function (user) {
        Factory.build('user', {email: user.email}, function (user2) {
          user2.save(function (err) {
            expect(err).to.exist;
            done();
          });
        });
      });
    });

    it('should show an error when try to save empty user', function (done) {
      return new User().save(function (err) {
        expect(err).to.exist;
        expect(err.errors).to.have.property('email');
        expect(err.errors).to.have.property('name');
        expect(err.errors).to.have.property('company');
        expect(err.errors).to.have.property('role');
        done();
      });
    });

    it('should show an error when try to save without valid email', function (done) {
      Factory.build('user', {email: 'invalid email address'}, function (user) {
        user.save(function (err) {
          expect(err).to.exist;
          expect(err.errors.email).to.have.property('message', 'Email格式不正确');
          done();
        });
      });
    });
  });

  describe('#attributes', function () {
    it('should have createdat and updatedat timestamp', function (done) {
      Factory.create('user', function (user) {
        expect(user.createdAt).to.exist;
        expect(user.updatedAt).to.exist;
        done();
      });
    });
  });

  describe('#authenticate', function () {
    it('should return true if given the correct password', function (done) {
      Factory.build('user', function (user) {
        expect(user.authenticate('password')).to.be.true;
        done();
      });
    });
    it('should return false if given the wrong password', function (done) {
      Factory.build('user', function (user) {
        expect(user.authenticate('invalid password')).to.be.false;
        done();
      });
    });

    it('should not allow deleted user to authenticate', function (done) {
      Factory.build('user', function (user) {
        user.deleted = true;
        expect(user.authenticate('password')).to.be.false;
        done();
      });
    });
  });

  describe('hasPositions', function () {
    var user, position;
    beforeEach(function (done) {
      helper.createPosition({name: '技术总监'}, function (err, p) {
        expect(err).to.not.exist;
        position = p;
        Factory.build('user', {positions: position._id, company: position.company}, function (u) {
          User.createUser(u, function (err, createdUser) {
            expect(err).to.not.exist;
            user = createdUser;
            expect(user.positions).to.have.length(1);
            done(err);
          });
        });
      });
    });

    describe('should return positions correctly', function () {
      describe(' when access by positions is NOT controlled', function () {
        beforeEach(function (done) {
          Factory.create('applicationSetting', {company: user.company}, function (setting) {
            expect(setting.positionRightControlled).to.be.false;
            done();
          });
        });

        it('should return the same input positions when query for nothing', function (done) {
          User.findOne({company: position.company}, function (err, user) {
            var inPositions;
            user.hasPositions(inPositions, function (err, ps) {
              expect(ps).to.not.exist;
              inPositions = null;
              user.hasPositions(inPositions, function (err, ps) {
                expect(ps).to.not.exist;
                inPositions = [];
                user.hasPositions(inPositions, function (err, ps) {
                  expect(ps).to.deep.equal(inPositions);
                  inPositions = ['财务总监，技术总监'];
                  user.hasPositions(inPositions, function (err, ps) {
                    expect(ps).to.deep.equal(inPositions);
                    done();
                  });
                });
              });
            });
          });
        });
      });

      describe(' when access by positions is controlled', function () {
        beforeEach(function (done) {
          Factory.create('applicationSetting', {positionRightControlled: true, company: user.company}, function (setting) {
            expect(setting.positionRightControlled).to.be.true;
            done();
          });
        });

        it('should return the positions the user owns when query for nothing', function (done) {
          User.findOne({company: position.company}, function (err, user) {
            var inPositions;
            user.hasPositions(inPositions, function (err, ps) {
              expect(ps).to.deep.equal(['技术总监']);
              done();
            });
          });
        });

        it('should return the intersectioned positions', function (done) {
          User.findOne({company: position.company}, function (err, user) {
            var inPositions = ['财务总监', '技术总监'];
            user.hasPositions(inPositions, function (err, ps) {
              expect(ps).to.deep.equal(['技术总监']);
              inPositions = [];
              user.hasPositions(inPositions, function (err, ps) {
                expect(ps).to.deep.equal([]);
                done();
              });
            });
          });
        });
      });
    });

  });
});
