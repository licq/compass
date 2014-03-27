'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    expect = require('chai').expect,
    Factory = require('../factory');

describe('User', function () {
    after(function (done) {
        User.remove().exec();
        Company.remove().exec();
        done();
    });

    describe('#validate', function () {
        it('should begin with no users', function (done) {
            User.find({}, function (err, users) {
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

        it('should fail to save an existing user again', function (done) {
            Factory('user', function (user) {
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
            Factory('user', function (user) {
                expect(user.created_at).to.exist;
                expect(user.updated_at).to.exist;
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
            })
        });
    });
});
