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
                expect(res.body.hits.total).to.equal(1);
                expect(res.body.facets.applyPosition.terms).to.have.length(1);
                expect(res.body.facets.applyPosition.terms[0].term).to.equal('cio');
                expect(res.body.facets.applyPosition.terms[0].count).to.equal(1);
                expect(res.body.facets.highestDegree.terms).to.have.length(1);
                expect(res.body.facets.highestDegree.terms[0].term).to.equal('master');
                expect(res.body.facets.highestDegree.terms[0].count).to.equal(1);
                expect(res.body.facets.age.entries).to.have.length(1);
                expect(res.body.facets.age.entries[0].key).to.equal(0);
                expect(res.body.facets.age.entries[0].count).to.equal(1);
                done(err);
            });
    });

    it('should return 0 resumes', function (done) {
        var req = request(app).get('/api/resumes?q=搜狐');
        req.cookies = cookies;
        req.expect(200)
            .end(function (err, res) {
                expect(res.body.hits.total).to.equal(0);
                done(err);
            });
    });

    it('should return a list of resumes', function (done) {
        var req = request(app).get('/api/resumes?q=阿里巴巴');

        req.cookies = cookies;
        req.expect(200)
            .expect('content-type', /json/)
            .end(function (err, res) {
                expect(res.body.hits.total).to.equal(1);
                expect(res.body.hits.hits[0]).to.have.property('_id');
                done(err);
            });
    });

    describe('using facets query', function () {
        beforeEach(function (done) {
            var birthday = new Date();
            birthday.setFullYear(birthday.getFullYear() - 20);

            Factory.build('resume', {company: existUser.company,
                applyPosition: '销售主管',
                educationHistory: [
                    {
                        degree: 'associate'
                    }
                ],
                birthday: birthday
            }, function (resume) {
                resume.save(function () {
                    setTimeout(done, 1000);
                });
            });
        });

        it('should return only one result if query for highestDegree=associate', function (done) {
            var req = request(app).get('/api/resumes?highestDegree=associate');

            req.cookies = cookies;
            req.expect(200)
                .expect('content-type', /json/)
                .end(function (err, res) {
                    expect(res.body.hits.total).to.equal(1);
                    done(err);
                });
        });

        it('should return no result if query for highestDegree=associate', function (done) {
            var req = request(app).get('/api/resumes?highestDegree=associate&age=20&age=25&applyPosition=cio');

            req.cookies = cookies;
            req.expect(200)
                .expect('content-type', /json/)
                .end(function (err, res) {
                    expect(res.body.hits.total).to.equal(0);
                    done(err);
                });
        });
    });
});