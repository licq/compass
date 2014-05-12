'use strict';

var
  Signup = require('mongoose').model('Signup'),
  expect = require('chai').expect,
  Factory = require('../factory'),
  helper = require('../testHelper');

describe('Signup', function () {
  beforeEach(function (done) {
    helper.clearCollections('User', 'Company', Signup, done);
  });

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
      Factory.create('company', function (company) {
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
      Factory.create('user', function (user) {
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
      Factory.create('signup', function (signup) {
        signup.activate(function (err, company, user) {
          expect(err).to.not.exist;
          expect(company).to.exist;
          expect(user).to.exist;
          done();
        });
      });
    });
  });
});

