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
    helper = require('./helper'),
    databaseHelper = require('../databaseHelper');


describe('applications', function () {
    var cookies,
        resume,
        user;

    beforeEach(function (done) {
        databaseHelper.clearCollections(User, Company, Application,
            Resume, function () {
                Factory.create('user', function (createdUser) {
                    user = createdUser;
                    Factory.create('resume', {company: user.company}, function (createdResume) {
                        resume = createdResume;
                        helper.login(user, function (cks) {
                            cookies = cks;
                            setTimeout(done, 1500);
                        });
                    });
                });
            });
    });

    describe('GET /api/applications?status=new&pageSize=10&page=1', function () {
        it('should return 200 with json result', function (done) {
            var req = request(app).get('/api/applications?status=new&pageSize=10&page=1');
            req.cookies = cookies;
            req.expect(200)
                .expect('content-type', /json/)
                .end(function (err, res) {
                    var result = res.body;
                    expect(result.hits.total).to.equal(1);
                    expect(result.hits.hits).to.have.length(1);
                    expect(result.facets.age).to.exist;
                    expect(result.facets.highestDegree).to.exist;
                    expect(result.facets.applyPosition).to.exist;
                    done(err);
                });
        });
    });
});


