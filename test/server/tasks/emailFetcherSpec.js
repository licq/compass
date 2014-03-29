var emailFetcher = require('../../../server/tasks/emailFetcher'),
    expect = require('chai').expect,
    mailer = require('../../../server/tasks/mailer'),
    async = require('async'),
    _ = require('lodash');

describe.skip('emailFetcher', function () {
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

    describe('#fetch', function () {
        it('should retrive email successfully', function (done) {
            this.timeout(0);

            async.eachSeries(_.range(3), function (i, callback) {
                mailer.sendSignupEmail('compass_test@126.com', i, function (error) {
                    callback(error);
                });
            }, function () {
                setTimeout(function () {
                    emailFetcher.fetch(mailbox, function (err) {
                        expect(err).to.not.exist;
                        done();
                    });
                }, 2000);
            });
        });
    });
});