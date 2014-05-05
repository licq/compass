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
});