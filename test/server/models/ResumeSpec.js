var mongoose = require('mongoose'),
    Resume = mongoose.model('Resume'),
    Company = mongoose.model('Company'),
    Application = mongoose.model('Application'),
    helper = require('../databaseHelper'),
    expect = require('chai').expect,
    Factory = require('../factory');

describe('Resume', function () {
    beforeEach(function (done) {
        helper.clearCollections(Resume,Company,Application,done);
    });

    describe('create', function () {
        it('should create successfully', function (done) {
            Factory.build('resume', function (resume) {
                resume.save(function (err, saved) {
                    expect(err).to.not.exist;
                    process.nextTick(function () {
                        Application.findOne({resume: saved._id}, function (err, application) {
                            expect(err).to.not.exist;
                            expect(application).to.exist;
                            expect(application.company.toString()).to.equal(resume.company.toString());
                            done();
                        });
                    });
                });
            });
        });
    });
});