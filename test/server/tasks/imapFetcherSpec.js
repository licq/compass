'use strict';

var imapFetcher = require('../../../server/tasks/imapFetcher'),
  expect = require('chai').expect,
  mailer = require('../../../server/tasks/mailer'),
  async = require('async'),
  _ = require('lodash'),
  Factory = require('../factory'),
  helper = require('../testHelper'),
  Email = require('mongoose').model('Email');

describe.skip('imapFetcher', function () {
  var mailbox,
    compass_test = {
      address: 'compass_test@126.com',
      account: 'compass_test@126.com',
      password: 'compass123',
      server: 'imap.126.com',
      tls: false,//true
      port: 143,//993
      protocol: 'imap',
      keepMails: false
    };
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
        imapFetcher.fetch(mailbox, function (err) {
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
        imapFetcher.fetch(mailbox, function (err, processedMails, retrievedMails) {
          expect(err).to.not.exist;
          expect(processedMails).to.be.equal(3);
          expect(retrievedMails).to.have.length(3);
          mailbox.retrievedMails = retrievedMails;
          imapFetcher.fetch(mailbox, function (err, processedMails, retrievedMails) {
            expect(err).to.not.exist;
            expect(processedMails).to.be.equal(0);
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
        imapFetcher.fetch(mailbox, function (err, processedMails, retrievedMails) {
          expect(err).to.not.exist;
          expect(processedMails).to.be.equal(3);
          expect(retrievedMails).to.have.length(3);
          mailbox.retrievedMails = retrievedMails;
          imapFetcher.fetch(mailbox, function (err, processedMails, retrievedMails) {
            expect(err).to.not.exist;
            expect(processedMails).to.be.equal(0);
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
        imapFetcher.fetch(mailbox, function (err, processedMails, retrievedMails) {
          expect(err).to.not.exist;
          expect(processedMails).to.be.equal(3);
          expect(retrievedMails).to.have.length(3);
          async.eachSeries(_.range(3), function (i, callback) {
            mailer.sendSignupEmail('applicant' + i, testmail.address, i, function (error) {
              callback(error);
            });
          }, function () {
            setTimeout(function () {
              mailbox.keepMails = false;
              mailbox.retrievedMails = retrievedMails;
              imapFetcher.fetch(mailbox, function (err, processedMails, retrievedMails) {
                expect(err).to.not.exist;
                expect(processedMails).to.be.equal(3);
                expect(retrievedMails).to.have.length(6);
                mailbox.retrievedMails = retrievedMails;
                imapFetcher.fetch(mailbox, function (err, processedMails, retrievedMails) {
                  expect(err).to.not.exist;
                  expect(processedMails).to.be.equal(0);
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