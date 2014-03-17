'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    should = require('should');

var user, user2;

describe('User', function () {
    before(function (done) {
        User.remove().exec();
        Company.remove().exec();

        Company.create({
            name: 'Company'
        }, function (err, company) {
            user = new User({
                name: 'Full name',
                email: 'test1@test.com',
                password: 'password',
                provider: 'local',
                company: company._id
            });

            user2 = new User({
                name: 'user2',
                email: 'test2@test.com',
                password: 'password',
                provider: 'local',
                company: company._id
            });

            done();
        });
    });

    afterEach(function (done) {
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
            user.save(done);
        });

        it('should fail to save an existing user again', function (done) {
            User.create(user2, function (err) {
                should.not.exist(err);
                user2.save(function (err) {
                    should.exist(err);
                    done();
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
            user.email = 'invalid email address';
            user.save(function (err) {
                should.exist(err);
                err.errors.should.have.property('email');
                err.errors.email.message.should.equal('Email格式不正确');
                done();
            });
        });
    });

    describe('#attributes', function () {
        it('should have createdat and updatedat timestamp', function (done) {
            user2.save();
            should.exist(user2.created_at);
            should.exist(user2.updated_at);
            done();
        });
    });

    describe('#authenticate', function () {
        it('should return true if given the correct password', function () {
            user2.authenticate('password').should.be.true;
        });
        it('should return false if given the wrong password', function () {
            user2.authenticate('wrong password').should.be.false;
        });
    });

});
