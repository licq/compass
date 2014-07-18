'use strict';

var
  Email = require('mongoose').model('Email'),
  expect = require('chai').expect,
  Factory = require('../factory'),
  helper = require('../testHelper');

describe('Email', function () {
  beforeEach(function (done) {
    helper.clearCollections(Email, 'Company', done);
  });

  describe('#validate', function () {
    it('should begin with no emails', function (done) {
      Email.count(function (err, count) {
        expect(count).to.equal(0);
        done();
      });
    });

    it('should be able to save without problems and got correct default value', function (done) {
      Factory.build('email', function (email) {
        email.save(function (err, saved) {
          expect(saved.port).to.equal(110);
          expect(saved.ssl).to.be.false;
          done(err);
        });
      });
    });

    it('should fail to save an existing email address again', function (done) {
      Factory.create('email', function (email) {
        Factory.build('email', {address: email.address}, function (aemail) {
          aemail.save(function (err) {
            expect(err).to.exist;
            done();
          });
        });
      });
    });

    it.skip('should fail to save an invalid account', function (done) {
      this.timeout(5000);
      Factory.build('email', {account: 'invalid account'}, function (email) {
        email.verify(function (err) {
          expect(err).to.exist;
          expect(err.message).to.equal('connect failed');
          done();
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
          expect(email.createdAt).to.exist;
          expect(email.updatedAt).to.exist;
          expect(email.totalRetrieveCount).to.equal(0);
          done();
        });
      });
    });
  });
});
