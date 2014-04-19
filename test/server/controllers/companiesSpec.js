'use strict';

var app = require('../../../server'),
    request = require('supertest'),
    expect = require('chai').expect,
    Factory = require('../factory'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    helper = require('./helper');


describe('/api/companies', function () {
    var cookies, company;

    before(function (done) {
        Company.remove().exec();
        User.remove().exec();
        Factory.create('user', function (user) {
            helper.login(user, function (cks) {
                cookies = cks;
                done();
            });
        });
    });

    describe('GET /api/companies', function () {
        it('should return 200 with json result', function (done) {
            var req = request(app).get('/api/companies');
            req.cookies = cookies;
            req.expect(200)
                .expect('content-type', /json/)
                .end(function (err, res) {
                    company = res.body[0];
                    expect(res.body).to.have.length(1);
                    done(err);
                });
        });
    });

    describe('GET /api/companies/:id', function () {
        it('should return 200 with json result', function (done) {
            var req = request(app).get('/api/companies/' + company._id);
            req.cookies = cookies;
            req.expect(200)
                .expect('content-type', /json/)
                .end(function (err, res) {
                    expect(err).to.not.exist;
                    expect(res.body.name).to.equal(company.name);
                    done();
                });
        });
    });
});


