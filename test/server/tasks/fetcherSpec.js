var fetcher = require('../../../server/tasks/fetcher'),
    expect = require('chai').expect,
    mailer = require('../../../server/tasks/mailer'),
    async = require('async'),
    _ = require('lodash');

describe.skip('fetcher', function () {
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

    describe('#verify', function () {
        it('should show server error if with invalid server address', function (done) {
            this.timeout(2000);
            mailbox.server = 'invalid.com.cbbb';
            fetcher.verify(mailbox, function (err) {
                expect(err).to.be.equal('connect failed');
                done();
            });
        });

        it('should login successfully', function (done) {
            this.timeout(2000);

            fetcher.verify(mailbox, function (err) {
                expect(err).to.not.exist;
                done();
            });
        });

        it('should show login error if account/password not correct', function (done) {
            this.timeout(60000);

            mailbox.password = 'invalid password';
            fetcher.verify(mailbox, function (err) {
                expect(err).to.equal('login failed');
                done();
            });
        });
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
                    fetcher.fetch(mailbox, function (err) {
                        expect(err).to.not.exist;
                        done();
                    });
                }, 2000);
            });
        });
    });
});