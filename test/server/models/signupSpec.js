'use strict';

var mongoose = require('mongoose'),
    Signup = mongoose.model('Signup'),
    Company = mongoose.model('Company'),
    User = mongoose.model('User'),
    should = require('should'),
    Factory = require('../factory');

var signup;

describe('Signup', function () {

    beforeEach(function (done) {
        Signup.remove().exec();
        Company.remove().exec();
        User.remove().exec();
        done();
    });

    describe('#validate', function () {
        it('should show errors if with empty arguments', function (done) {
            new Signup().save(function (err) {
                should.exist(err);
                err.errors['companyName'].type.should.equal('required');
                err.errors['adminName'].type.should.equal('required');
                err.errors['adminPassword'].type.should.equal('required');
                err.errors['adminEmail'].type.should.equal('required');

                done();
            });
        });

        it('should show errors if with invalid email', function (done) {
            Factory.build('signup', {adminEmail: 'invalid email'}, function (signup) {
                signup.save(function (err) {
                    err.errors['adminEmail'].type.should.equal('user defined');
                    err.errors['adminEmail'].message.should.equal('Email格式错误');
                    done();
                });
            })
        });


        it('should show error if the company already existed', function (done) {
            Factory('company', function (company) {
                Factory.build('signup', {companyName: company.name}, function (signup) {
                    signup.save(function (err) {
                        should.exist(err);
                        err.errors.companyName.message.should.equal('该公司已注册');
                        done();
                    });
                });
            });

        });

        it('should show error if the user already existed', function (done) {
            Factory('user', function (user) {
                Factory.build('signup', {'adminEmail': user.email}, function (signup) {
                    signup.save(function (err) {
                        should.exist(err);
                        err.errors['adminEmail'].message.should.equal('该邮箱已注册');
                        done();
                    });
                });
            });
        });
    });


    describe('#create', function () {
        it('should create new signup', function (done) {
            Factory.build('signup', function (signup) {
                signup.save(done);
            });
        });
    });

    describe('#activate', function () {
        it('should create new company and admin use when activate', function (done) {
            Factory('signup', function (signup) {
                signup.activate(function (err, company, user) {
                    should.not.exist(err);
                    should.exist(company);
                    should.exist(user);
                    done();
                });
            });
        });
    });

    after(function (done) {
        User.remove().exec();
        Company.remove().exec();
        Signup.remove().exec();
        done();
    });
});

