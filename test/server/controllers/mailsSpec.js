'use strict';

var app = require('../../../server'),
    request = require('supertest'),
    expect = require('chai').expect,
    Factory = require('../factory'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Company = mongoose.model('Company');


describe('/api/mails', function () {
    var cookies;

    before(function (done) {
        Company.remove().exec();
        User.remove().exec();

        Factory('user', function (user) {
            request(app).post('/api/sessions')
                .send({email: user.email, password: user.password})
                .expect(200)
                .end(function (err, res) {
                    console.log(res.headers['set-cookie']);
                    cookies = res.headers['set-cookie'].pop().split(';')[0];
                    done();
                });
        });
    });

    describe('GET /api/mails', function () {
        it('should return 200 with html result', function (done) {
            var req = request(app).get('/api/mails');
            req.cookies = cookies;

            req.expect(200)
                .expect('Content-Type', /json/)
                .end(function (err) {
                    expect(err).to.not.exist;
                    done();
                });
        });
    });
});


