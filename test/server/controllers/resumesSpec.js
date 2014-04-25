var app = require('../../../server'),
    mongoose = require('mongoose'),
    Resume = mongoose.model('Resume'),
    databaseHelper = require('../databaseHelper'),
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    Factory = require('../factory'),
    helper = require('./helper'),
    request = require('supertest'),
    expect = require('chai').expect;

describe('#resumes', function () {
    var cookies, existUser, existResume;

    beforeEach(function (done) {
        databaseHelper.clearCollections(User, Company, Resume, function () {
            Resume.clearAll(function () {
                Factory.create('user', function (user) {
                    existUser = user;
                    helper.login(user, function (cks) {
                        cookies = cks;
                        Factory.create('resume', {company: user.company}, function (resume) {
                            existResume = resume;
                            setTimeout(done, 1000);
                        });
                    });
                });
            });
        });
    });

    it('should return all resumes', function (done) {
        var req = request(app).get('/api/resumes');
        req.cookies = cookies;
        req.expect(200)
            .expect('content-type', /json/)
            .end(function (err, res) {
                expect(res.body).to.have.length(1);
                expect(res.get('totalCount')).to.equal('1');
                done(err);
            });
    });

    it('should return 0 resumes', function (done) {
        var req = request(app).get('/api/resumes?q=搜狐');
        req.cookies = cookies;
        req.expect(200)
            .end(function (err, res) {
                expect(res.body).to.have.length(0);
                done(err);
            });
    });

    it('should return a list of resumes', function (done) {
        var req = request(app).get('/api/resumes?q=阿里巴巴');

        req.cookies = cookies;
        req.expect(200)
            .expect('content-type', /json/)
            .end(function (err, res) {
                expect(res.body).to.have.length(1);
                expect(res.body[0]).to.have.property('_id');
                done(err);
            });
    });
});