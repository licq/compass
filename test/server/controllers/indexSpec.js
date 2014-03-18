'use strict';

var app = require('../../../server'),
    request = require('supertest'),
    expect = require('chai').expect;


describe('/', function () {

    describe('GET /anything', function () {
        it('should return 200 with html result', function (done) {
            request(app)
                .get('/anything')
                .expect(200)
                .expect('Content-Type', /html/)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.text).to.have.string('<html');
                    done();
                });
        });
    });

    describe('GET /api/nothingshouldcalledthisname', function () {
        it('should return 404 when call /api/nothing', function (done) {
            request(app)
                .get('/api/nothingshouldcalledthisname')
                .expect(404)
                .end(done);
        });
    });
});


