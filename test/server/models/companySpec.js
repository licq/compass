'use strict';

var mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  expect = require('chai').expect,
  Factory = require('../factory'),
  helper = require('../testHelper');

describe('Company', function () {
  beforeEach(function (done) {
    helper.clearCollections(Company, done);
  });

  describe('#validate', function () {
    it('should begin with no companies', function (done) {
      Company.find({}, function (err, companies) {
        expect(companies).to.be.empty;
        done();
      });
    });
  });

  describe('#attributes', function () {
    it('should have createdat and updatedat timestamp', function (done) {
      Factory.create('company', function (company) {
        expect(company.createdAt).to.exist;
        expect(company.updatedAt).to.exist;
        done();
      });
    });
  });
});
