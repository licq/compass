'use strict';

var mongoose = require('mongoose'),
    Signup = mongoose.model('Signup'),
    Company = mongoose.model('Company'),
    User = mongoose.model('User'),
    expect = require('chai').expect,
    Factory = require('../factory');

describe('Signup', function () {

    describe('#validate', function () {
        it('should show errors if with empty arguments', function (done) {
            new Signup().save(function (err) {
                expect(err).to.exist;
                expect(err.errors.companyName).to.have.property('type', 'required');
                expect(err.errors.adminName).to.have.property('type', 'required');
                expect(err.errors.adminPassword).to.have.property('type', 'required');
                expect(err.errors.adminEmail).to.have.property('type', 'required');

                done();
            });
        });

        it('should show errors if with invalid email', function (done) {
            Factory.build('signup', {adminEmail: 'invalid email'}, function (signup) {
                signup.save(function (err) {
                    expect(err.errors.adminEmail).to.have.property('type', 'user defined');
                    expect(err.errors.adminEmail).to.have.property('message', 'Email格式错误');
                    done();
                });
            });
        });


        it('should show error if the company already existed', function (done) {
            Factory('company', function (company) {
                Factory.build('signup', {companyName: company.name}, function (signup) {
                    signup.save(function (err) {
                        expect(err).to.exist;
                        expect(err.errors.companyName).to.have.property('message', '该公司已注册');
                        done();
                    });
                });
            });

        });

        it('should show error if the user already existed', function (done) {
            Factory('user', function (user) {
                Factory.build('signup', {'adminEmail': user.email}, function (signup) {
                    signup.save(function (err) {
                        expect(err).to.exist;
                        expect(err.errors.adminEmail).to.have.property('message', '该邮箱已注册');
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
                    expect(err).to.not.exist;
                    expect(company).to.exist;
                    expect(user).to.exist;
                    done();
                });
            });
        });
    });

    beforeEach(function (done) {
        User.remove().exec();
        Company.remove().exec();
        Signup.remove().exec();
        done();
    });

    after(function (done) {
        User.remove().exec();
        Company.remove().exec();
        Signup.remove().exec();
        done();
    });
});

