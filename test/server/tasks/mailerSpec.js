'use strict';

var mailer = require('../../../server/tasks/mailer');

describe.skip('mailer', function () {
  describe('sendSignupEmail', function () {
    this.timeout(10000);
    it('should send signup email', function (done) {
      mailer.sendSignupEmail('applicant', 'compass_test@126.com', 'aabbcc', done);
    });
  });
});