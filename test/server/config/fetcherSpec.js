var Fetcher = require('../../../server/config/fetcher'),
    expect = require('chai').expect;

describe('fetcher', function () {
    describe('#verify', function () {
        it.skip('should show server error if with invalid server address', function (done) {
            this.timeout(0);
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

        it.skip('should login successfully', function (done) {
            this.timeout(0);
            var fetcher = new Fetcher({
                address: '',
                account: 'compass_test@126.com',
                password: 'compass123',
                ssl: false,
                port: 110,
                server: 'pop.126.com'
            });

            fetcher.all(function (err) {
                console.log('success');
                expect(err).to.not.exist;
                done();
            });
        });
    });
});