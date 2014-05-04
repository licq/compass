var mongoose = require('mongoose'),
    Resume = mongoose.model('Resume'),
    Company = mongoose.model('Company'),
    Application = mongoose.model('Application'),
    helper = require('../databaseHelper'),
    expect = require('chai').expect,
    Factory = require('../factory');

describe('Resume', function () {
    this.timeout(10000);
    beforeEach(function (done) {
        helper.clearCollections(Resume, Company, Application, function () {
            Resume.clearAll(function () {
                setTimeout(done, 1500);
            });
        });
    });

    describe('elasticsearch', function () {
        it('should not have resume indexes in elasticsearch', function (done) {
            Resume.query({}, function (err, res) {
                expect(err).to.not.exist;
                expect(res.hits.total).to.equal(0);
                done();
            });
        });
    });

    describe('create', function () {
        it('should index to elasticsearch', function (done) {
            Factory.create('resume', function (resume) {
                expect(resume.status).to.equal('new');
                resume.on('es-indexed', function () {
                    setTimeout(function () {
                        Resume.query({}, function (err, res) {
                            expect(err).to.not.exist;
                            expect(res.hits.total).to.equal(1);
                            expect(res.hits.hits[0].status).to.equal('new');
                            done();
                        });
                    }, 1000);
                });
            });
        });
    });
});