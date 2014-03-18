'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    should = require('should'),
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
                users.should.have.length(0);
                done();
            });
        });

        it('should be able to save without problems', function (done) {
            Factory.build('user', function (user) {
                user.save(done);
            });
        });

        it('should fail to save an existing user again', function (done) {
            Factory('user', function (user) {
                Factory.build('user', {email: user.email}, function (user2) {
                    user2.save(function (err) {
                        should.exist(err);
                        done();
                    });
                });
            });
        });


        it('should show an error when try to save empty user', function (done) {
            return new User().save(function (err) {
                should.exist(err);
                err.errors.should.have.property('email');
                err.errors.should.have.property('name');
                err.errors.should.have.property('company');
                done();
            });
        });

        it('should show an error when try to save without valid email', function (done) {
            Factory.build('user', {email: 'invalid email address'}, function (user) {
                user.save(function (err) {
                    should.exist(err);
                    err.errors.should.have.property('email');
                    err.errors.email.message.should.equal('Email格式不正确');
                    done();
                });
            });
        });
    });

    describe('#attributes', function () {
        it('should have createdat and updatedat timestamp', function (done) {
            Factory('user', function (user) {
                should.exist(user.created_at);
                should.exist(user.updated_at);
                done();
            });
        });
    });

    describe('#authenticate', function () {
        it('should return true if given the correct password', function () {
            Factory.build('user', function (user) {
                user.authenticate('password').should.be.true;
            });
        });
        it('should return false if given the wrong password', function () {
            Factory.build('user', function (user) {
                user.authenticate('invalid password').should.be.false;
            });
        });
    });

})
;
