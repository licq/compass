'use strict';

var emailChecker = require('../../../server/tasks/emailChecker'),
  expect = require('chai').expect;

describe.skip('imapFetcher', function () {
  var mailbox;

  beforeEach(function () {
    mailbox = {
      address: 'compass_test@126.com',
      account: 'compass_test@126.com',
      password: 'compass123',
      ssl: false,
      port: 110,
      server: 'pop.126.com'
    };
  });

  describe('#check', function () {
    it('should show server error if with invalid server address', function (done) {
      this.timeout(2000);
      mailbox.server = 'invalid.com.cbbb';
      emailChecker.check(mailbox, function (err) {
        expect(err).to.be.equal('connect failed');
        done();
      });
    });

    it('should login successfully', function (done) {
      this.timeout(2000);

      emailChecker.check(mailbox, function (err) {
        expect(err).to.not.exist;
        done();
      });
    });

    it('should show login error if account/password not correct', function (done) {
      this.timeout(60000);

      mailbox.password = 'invalid password';
      emailChecker.check(mailbox, function (err) {
        expect(err).to.equal('login failed');
        done();
      });
    });
  });
});