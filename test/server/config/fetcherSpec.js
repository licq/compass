var Fetcher = require('../../../server/config/fetcher'),
    expect = require('chai').expect;

describe('fetcher', function () {
    describe('#verify', function () {
        it('should show server error if with invalid server address', function (done) {
            this.timeout(200);
            var fetcher = new Fetcher({
                address: '',
                account: 'compass_test',
                password: 'compass123',
                ssl: false,
                port: 110,
                server: ''
            });

            fetcher.verify(function (err) {
                expect(err).to.exist;
                done();
            });
        });

        it('should login successfully', function (done) {
            this.timeout(200);
            var fetcher = new Fetcher({
                address: '',
                account: 'compass_test@126.com',
                password: 'compass123',
                ssl: false,
                port: 110,
                server: 'pop.126.com'
            });

            fetcher.verify(function (err) {
                expect(err).to.not.exist;
                done();
            });
        });
    });

    describe.only('#all', function () {

        it('should retrive email successfully', function (done) {
            this.timeout(2000);
            var fetcher = new Fetcher({
                address: 'compass_test@126.com',
                account: 'compass_test@126.com',
                password: 'compass123',
                ssl: false,
                port: 110,
                server: 'pop.126.com'
            });

            fetcher.all(function (err) {
                expect(err).to.not.exist;
                done();
            });
        });
    });
});