'use strict';

var mongoose = require('mongoose'),
    Email = mongoose.model('Email'),
    Company = mongoose.model('Company'),
    expect = require('chai').expect,
    Factory = require('../factory');

describe('Email', function () {

    before(function (done) {
        Email.remove().exec();
        Company.remove().exec();
        done();
    });

    describe('#validate', function () {
        it('should begin with no emails', function (done) {
            Email.find({}, function (err, emails) {
                expect(emails).have.length(0);
                done();
            });
        });

        it('should be able to save without problems and got correct default value', function (done) {
            Factory.build('email', function (email) {
                email.save(function (err, saved) {
                    expect(saved.port).to.equal(110);
                    expect(saved.ssl).to.be.false;
                    done();
                });
            });
        });

        it('should fail to save an existing email address again', function (done) {
            Factory('email', function (email) {
                Factory.build('email', {address: email.address}, function (aemail) {
                    aemail.save(function (err) {
                        expect(err).to.exist;
                        done();
                    });
                });
            });
        });

        it('should show an error when try to save empty user', function (done) {
            new Email().save(function (err) {
                expect(err).to.exist;
                expect(err.errors).to.have.property('address');
                expect(err.errors).to.have.property('account');
                expect(err.errors).to.have.property('password');
                expect(err.errors).to.have.property('server');
                expect(err.errors).to.have.property('company');
                done();
            });
        });

        it('should show an error when try to save without valid email', function (done) {
            Factory.build('email', {address: 'invalid email'}, function (email) {
                email.save(function (err) {
                    expect(err).to.exist;
                    expect(err.errors.address).to.have.property('message', 'Email格式不正确');
                    done();
                });
            });
        });
    });

    describe('#attributes', function () {
        it('should have createdat and updatedat timestamp', function (done) {
            Factory.build('email', function (email) {
                email.save(function () {
                    expect(email.created_at).to.exist;
                    expect(email.updated_at).to.exist;
                    expect(email.totalRetrieveCount).to.equal(0);
                    done();
                });
            });
        });
    });

    describe('#setActivity', function () {
        it('should set activity to the same email account', function (done) {
            Factory('email', function (email) {
                Email.setActivity({
                    address: email.address,
                    count: 10,
                    time: Date.now()
                }, function (err) {
                    expect(err).to.not.exist;
                    Email.setActivity({
                        address: email.address,
                        count: 10,
                        time: Date.now()
                    }, function (err, saved) {
                        expect(err).to.not.exist;
                        expect(saved.lastRetrieveCount).to.equal(10);
                        expect(saved.totalRetrieveCount).to.equal(20);
                        done();
                    });
                });
            });
        });
    });
});
