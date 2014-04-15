'use strict';

var app = require('../../../server'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    expect = require('chai').expect,
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    Resume = mongoose.model('Resume'),
    Application = mongoose.model('Application'),
    Factory = require('../factory'),
    helper = require('./helper');


describe('applications', function () {
    var cookies,
        resume,
        user;

    function cleanData() {
        User.remove().exec();
        Company.remove().exec();
        Application.remove().exec();
        Resume.remove().exec();
    }

    beforeEach(function (done) {
        cleanData();
        Factory.create('user', function (createdUser) {
            user = createdUser;
            Factory.create('resume', {company: user.company}, function (createdResume) {
                resume = createdResume;
                helper.login(user, function (cks) {
                    cookies = cks;
                    done();
                });
            });
        });
    });

    after(function (done) {
        cleanData();
        done();
    });

    describe('GET /api/applications?status=new&pageSize=10&page=1', function () {
        it('should return 200 with json result', function (done) {
            var req = request(app).get('/api/applications?status=new&pageSize=10&page=1');
            req.cookies = cookies;
            req.expect(200)
                .expect('content-type', /json/)
                .end(function (err, res) {
                    expect(res.body).to.have.length(1);
                    expect(res.get('totalCount')).to.equal('1');
                    done(err);
                });
        });
    });
});


