'use strict';

var imapChecker = require('../../../server/tasks/imapChecker'),
  expect = require('chai').expect;

describe.only('imapChecker', function () {
  var mailbox;

  beforeEach(function () {
    mailbox = {
      user: 'compass_test@126.com',
      account: 'compass_test@126.com',
      password: 'compass123',
      host: 'imap.126.com',
      tls: false,//true
      port: 143,//993
      protocol: 'imap',
      keepMails: false};
  });

  describe('#check', function () {
    it('should show server error if with invalid server address', function (done) {
      this.timeout(2000);
      mailbox.host = 'invalid.com.cbbb';
      imapChecker.check(mailbox, function (err) {
        expect(err).to.be.equal('connect failed');
        done();
      });
    });

    it('should login successfully', function (done) {
      this.timeout(2000);

      imapChecker.check(mailbox, function (err) {
        expect(err).to.not.exist;
        done();
      });
    });

    it('should show login error if account/password not correct', function (done) {
      this.timeout(60000);

      mailbox.password = 'invalid password';
      imapChecker.check(mailbox, function (err) {
        expect(err).to.equal('login failed');
        done();
      });
    });
  });
});