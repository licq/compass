'use strict';

var imapFetcher = require('../../../server/tasks/imapFetcher'),
  expect = require('chai').expect,
  mailer = require('../../../server/tasks/mailer'),
  async = require('async'),
  _ = require('lodash'),
  Factory = require('../factory'),
  helper = require('../testHelper'),
  Email = require('mongoose').model('Email');

describe.only('imapFetcher', function () {
  var mailbox,
    compass_test = {
      address: 'compass_test@126.com',
      account: 'compass_test@126.com',
      password: 'compass123',
      server: 'imap.126.com',
      tls: false,//true
      port: 143,//993
      protocol: 'imap',
      keepMails: false};
//    },
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
    helper.clearCollections(Email, 'Company', 'User', function () {
      console.log('clear done');
      Factory.create('email', testmail, function (mb) {
        mailbox = mb;
        mailbox.host = mailbox.server;
        mailbox.user = mailbox.address;
       // mailbox.debug = console.log;
        console.log('mb ', mailbox);
        imapFetcher.fetch(mailbox, function (err) {
          expect(err).to.not.exist;
          async.eachSeries(_.range(3), function (i, callback) {
            mailer.sendSignupEmail('applicant' + i, testmail.address, i, function (error) {
              console.log('send ', i);
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
      console.log('----------------test1---------------');
      setTimeout(function () {
        imapFetcher.fetch(mailbox, function (err, processedMails, totalMails) {
          expect(err).to.not.exist;
          expect(processedMails).to.be.equal(3);
          expect(totalMails).to.be.equal(3);
          imapFetcher.fetch(mailbox, function (err, processedMails, totalMails) {
            expect(err).to.not.exist;
            expect(processedMails).to.be.equal(0);
            expect(totalMails).to.be.equal(0);
            Email.findOne({address: mailbox.address}, function (err, email) {
              expect(err).to.not.exist;
              expect(email.retrievedMails).to.have.length(0);
              done();
            });
          });
        });
      }, timeout);
    });

    it('should retrieve and keep emails', function (done) {
      this.timeout(0);
      console.log('----------------test2---------------');
      setTimeout(function () {
        mailbox.keepMails = true;
        imapFetcher.fetch(mailbox, function (err, processedMails, totalMails) {
          expect(err).to.not.exist;
          expect(processedMails).to.be.equal(3);
          expect(totalMails).to.be.equal(3);
          imapFetcher.fetch(mailbox, function (err, processedMails, totalMails) {
            expect(err).to.not.exist;
            expect(processedMails).to.be.equal(0);
            expect(totalMails).to.be.equal(3);
            Email.findOne({address: mailbox.address}, function (err, email) {
              expect(err).to.not.exist;
              expect(email.retrievedMails).to.have.length(3);
              expect(email.keepMails).to.be.true;
              done();
            });
          });
        });
      }, timeout);
    });

    it('should retrieve new mails and delete all old emails', function (done) {
      this.timeout(0);
      console.log('----------------test3---------------');
      setTimeout(function () {
        mailbox.keepMails = true;
        imapFetcher.fetch(mailbox, function (err, processedMails, totalMails) {
          expect(err).to.not.exist;
          expect(processedMails).to.be.equal(3);
          expect(totalMails).to.be.equal(3);
          async.eachSeries(_.range(3), function (i, callback) {
            mailer.sendSignupEmail('applicant' + i, testmail.address, i, function (error) {
              callback(error);
            });
          }, function () {
            setTimeout(function () {
              mailbox.keepMails = false;
              imapFetcher.fetch(mailbox, function (err, processedMails, totalMails) {
                expect(err).to.not.exist;
                expect(processedMails).to.be.equal(6);
                expect(totalMails).to.be.equal(6);
                imapFetcher.fetch(mailbox, function (err, processedMails, totalMails) {
                  expect(err).to.not.exist;
                  expect(processedMails).to.be.equal(0);
                  expect(totalMails).to.be.equal(0);
                  Email.findOne({address: mailbox.address}, function (err, email) {
                    expect(err).to.not.exist;
                    expect(email.retrievedMails).to.have.length(0);
                    expect(email.keepMails).to.be.false;
                    done();
                  });
                });
              });
            }, timeout);
          });
        });
      }, timeout);
    });
  });
});