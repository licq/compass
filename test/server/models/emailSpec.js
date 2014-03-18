'use strict';

var mongoose = require('mongoose'),
    Email = mongoose.model('Email'),
    Company = mongoose.model('Company'),
    should = require('should'),
    Factory = require('../factory');

describe('Email', function () {

    after(function (done) {
        Email.remove().exec();
        Company.remove().exec();
        done();
    });

    describe('#validate', function () {
        it('should begin with no emails', function (done) {
            Email.find({}, function (err, emails) {
                emails.should.have.length(0);
                done();
            });
        });

        it('should be able to save without problems and got correct default value', function (done) {
            Factory.build('email', function (email) {
                email.save(function (err, saved) {
                    saved.port.should.equal(110);
                    saved.ssl.should.be.false;
                    saved.secure.should.be.false;
                    done();
                });
            });
        });

        it('should fail to save an existing email address again', function (done) {
            Factory('email', function (email) {
                Factory.build('email', {address: email.address}, function (aemail) {
                    aemail.save(function (err) {
                        should.exist(err);
                        done();
                    });
                });
            });
        });

        it('should show an error when try to save empty user', function (done) {
            new Email().save(function (err) {
                should.exist(err);
                err.errors.should.have.property('address');
                err.errors.should.have.property('account');
                err.errors.should.have.property('password');
                err.errors.should.have.property('server');
                err.errors.should.have.property('company');
                done();
            });
        });

        it('should show an error when try to save without valid email', function (done) {
            Factory.build('email', {address: 'invalid email'}, function (email) {
                email.save(function (err) {
                    should.exist(err);
                    err.errors.should.have.property('address');
                    err.errors.address.message.should.equal('Email格式不正确');
                    done();
                });
            });
        });
    });

    describe('#attributes', function () {
        it('should have createdat and updatedat timestamp', function (done) {
            Factory.build('email', function (email) {
                email.save(function () {
                    should.exist(email.created_at);
                    should.exist(email.updated_at);
                    done();
                });
            });
        });
    });

});
