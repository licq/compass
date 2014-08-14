'use strict';

var pop3Checker = require('../../../server/tasks/pop3Checker'),
  expect = require('chai').expect;

describe.skip('pop3Checker', function () {
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
      pop3Checker.check(mailbox, function (err) {
        expect(err).to.be.equal('connect failed');
        done();
      });
    });

    it('should login successfully', function (done) {
      this.timeout(2000);
      pop3Checker.check(mailbox, function (err) {
        expect(err).to.not.exist;
        done();
      });
    });

    it('should show login error if account/password not correct', function (done) {
      this.timeout(60000);
      mailbox.password = 'invalid password';
      pop3Checker.check(mailbox, function (err) {
        expect(err).to.equal('login failed');
        done();
      });
    });

    it('should connect to jj-inn.com', function (done) {
      mailbox = {
        address: 'jinjianghr@jj-inn.com',
        account: 'jinjianghr@jj-inn.com',
        password: 'Pass@word1',
        ssl: false,
        port: 110,
        server: 'mail.jj-inn.com'
      };
      pop3Checker.check(mailbox, function (err) {
        expect(err).to.not.exist;
        done();
      });
    });
  });
});