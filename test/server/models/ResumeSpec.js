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
            Resume.search({query: {match_all: {}}}, function (err, res) {
                expect(err).to.not.exist;
                expect(res.hits.total).to.equal(0);
                done();
            });
        });
    });

    describe('create', function () {
        it('should create successfully', function (done) {
            Factory.build('resume', function (resume) {
                resume.save(function (err, saved) {
                    expect(err).to.not.exist;
                    setTimeout(function () {
                        Application.findOne({resume: saved._id}, function (err, application) {
                            expect(err).to.not.exist;
                            expect(application).to.exist;
                            expect(application.company.toString()).to.equal(resume.company.toString());
                            done();
                        });
                    }, 1000);
                });
            });
        });
        it('should index to elasticsearch', function (done) {
            Factory.create('resume', function (resume) {
                resume.on('es-indexed', function () {
                    setTimeout(function () {
                        Resume.search({
                            query: {
                                match_all: {}
                            }
                        }, function (err, res) {
                            expect(err).to.not.exist;
                            expect(res.hits.total).to.equal(1);
                            done();
                        });
                    }, 1000);
                });
            });
        });

    });
});