'use strict';

var
  Role = require('mongoose').model('Role'),
  expect = require('chai').expect,
  Factory = require('../factory'),
  helper = require('../testHelper');

describe('Role', function () {
  beforeEach(function (done) {
    helper.clearCollections('Company','Role', done);
  });

  describe('#validate', function () {
    it('should begin with no roles', function (done) {
      Role.find({}, function (err, roles) {
        expect(roles).to.be.empty;
        done();
      });
    });

    it('should be able to save without problems', function (done) {
      Factory.build('role', function (role) {
        role.save(function (err) {
         expect(err).to.not.exist;
          done(err);
        });
      });
    });

    it('should fail to save an existing role again', function (done) {
      Factory.create('role', function (role) {
        Factory.build('role', {name: role.name, company:role.company}, function (role2) {
          role2.save(function (err) {
            expect(err).to.exist;
            done();
          });
        });
      });
    });

    it('should show an error when try to save empty role', function (done) {
      return new Role().save(function (err) {
        expect(err).to.exist;
        expect(err.errors).to.have.property('name');
        expect(err.errors).to.have.property('company');
        done();
      });
    });
  });

  describe('#attributes', function () {
    it('should have createdat and updatedat timestamp', function (done) {
      Factory.create('role', function (role) {
        expect(role.createdAt).to.exist;
        expect(role.updatedAt).to.exist;
        done();
      });
    });
  });

});
