'use strict';

var pop3Fetcher = require('../../../server/tasks/pop3Fetcher'),
  expect = require('chai').expect,
  mailer = require('../../../server/tasks/mailer'),
  async = require('async'),
  _ = require('lodash'),
  Factory = require('../factory'),
  helper = require('../testHelper'),
  Email = require('mongoose').model('Email');

describe.only('pop3Fetcher', function () {
  var mailbox,
    compass_test = {
      address: 'compass_test@126.com',
      account: 'compass_test@126.com',
      password: 'compass123',
      server: 'pop.126.com',
      ssl: false,//true
      port: 110,//993
      protocol: 'pop3',
      keepMails: false};
//    lingpin = {'address': 'yuzhihang@lingpin.cc',
//      'account': 'yuzhihang@lingpin.cc',
//      'password': 'compass.123',
//      'server': 'pop.exmail.qq.com',
//      'ssl': false,
//      'port': 110,
//      keepMails: false
//    };

  var testmail = compass_test, timeout = 5000;
  beforeEach(function (done) {
    helper.clearCollections(Email, 'Company', 'User', 'Mail', 'Resume', function () {
      Factory.create('email', testmail, function (mb) {
        mailbox = mb;
        pop3Fetcher.fetch(mailbox, function (err) {
          expect(err).to.not.exist;
          async.eachSeries(_.range(3), function (i, callback) {
            mailer.sendSignupEmail('applicant' + i, testmail.address, i, function (error) {
              callback(error);
            });
          }, function () {
            done();
          });
        });
      });
    });
  });

  describe('#fetch', function () {
    it('should retrieve and delete emails', function (done) {
      this.timeout(0);
      setTimeout(function () {
        pop3Fetcher.fetch(mailbox, function (err, processedMails, totalMails, retrievedMails) {
          expect(err).to.not.exist;
          expect(processedMails).to.be.equal(3);
          expect(totalMails).to.be.equal(3);
          expect(retrievedMails).to.have.length(0);
          mailbox.retrievedMails = retrievedMails;
          pop3Fetcher.fetch(mailbox, function (err, processedMails, totalMails, retrievedMails) {
            expect(err).to.not.exist;
            expect(processedMails).to.be.equal(0);
            expect(totalMails).to.be.equal(0);
            expect(retrievedMails).to.have.length(0);
            done();
          });
        });
      }, timeout);
    });

    it('should retrieve and keep emails', function (done) {
      this.timeout(0);
      setTimeout(function () {
        mailbox.keepMails = true;
        pop3Fetcher.fetch(mailbox, function (err, processedMails, totalMails, retrievedMails) {
          expect(err).to.not.exist;
          expect(processedMails).to.be.equal(3);
          expect(totalMails).to.be.equal(3);
          expect(retrievedMails).to.have.length(3);
          mailbox.retrievedMails = retrievedMails;
          pop3Fetcher.fetch(mailbox, function (err, processedMails, totalMails, retrievedMails) {
            expect(err).to.not.exist;
            expect(processedMails).to.be.equal(0);
            expect(totalMails).to.be.equal(3);
            expect(retrievedMails).to.have.length(3);
            done();
          });
        });
      }, timeout);
    });

    it('should retrieve new mails and delete all old emails', function (done) {
      this.timeout(0);
      setTimeout(function () {
        mailbox.keepMails = true;
        pop3Fetcher.fetch(mailbox, function (err, processedMails, totalMails, retrievedMails) {
          expect(err).to.not.exist;
          expect(processedMails).to.be.equal(3);
          expect(totalMails).to.be.equal(3);
          expect(retrievedMails).to.have.length(3);
          async.eachSeries(_.range(3), function (i, callback) {
            mailer.sendSignupEmail('applicant' + i, testmail.address, i, function (error) {
              callback(error);
            });
          }, function () {
            setTimeout(function () {
              mailbox.keepMails = false;
              pop3Fetcher.fetch(mailbox, function (err, processedMails, totalMails, retrievedMails) {
                expect(err).to.not.exist;
                expect(processedMails).to.be.equal(6);
                expect(totalMails).to.be.equal(6);
                expect(retrievedMails).to.have.length(0);
                mailbox.retrievedMails = retrievedMails;
                pop3Fetcher.fetch(mailbox, function (err, processedMails, totalMails, retrievedMails) {
                  expect(err).to.not.exist;
                  expect(processedMails).to.be.equal(0);
                  expect(totalMails).to.be.equal(0);
                  expect(retrievedMails).to.have.length(0);
                  done();
                });
              });
            }, timeout);
          });
        });
      }, timeout);
    });
  });
});