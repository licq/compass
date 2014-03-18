'use strict';

var mongoose = require('mongoose'),
    Email = mongoose.model('Email'),
    Company = mongoose.model('Company'),
    should = require('should');

var email,email2;

describe('Email', function () {
    before(function (done) {
        Email.remove().exec();
        Company.remove().exec();

        Company.create({
            name: 'Company'
        }, function (err, company) {
            email = new Email({
                address: 'address@email.com',
                account: 'address',
                password: 'password',
                server: 'email.com',
                company: company._id
            });
            email2 = new Email({
                address: 'address2@email.com',
                account: 'address2',
                password: 'password',
                server: 'email.com',
                company: company._id
            });

            done();
        });
    });

    afterEach(function (done) {
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
            email.save(function(err,saved){
              saved.port.should.equal(110);
              saved.ssl.should.be.false;
              saved.secure.should.be.false;
              done();
            });
        });

        it('should fail to save an existing email address again', function (done) {
            Email.create(email2, function (err) {
                should.not.exist(err);
                email2.save(function (err) {
                    should.exist(err);
                    done();
                });
            });
        });

        it('should show an error when try to save empty user', function (done) {
            return new Email().save(function (err) {
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
            email.address = 'invalid email address';
            email.save(function (err) {
                should.exist(err);
                err.errors.should.have.property('address');
                err.errors.address.message.should.equal('Email格式不正确');
                done();
            });
        });
    });

    describe('#attributes', function () {
        it('should have createdat and updatedat timestamp', function (done) {
            email2.save();
            should.exist(email2.created_at);
            should.exist(email2.updated_at);
            done();
        });
    });

});
