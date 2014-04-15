var mongoose = require('mongoose'),
    Resume = mongoose.model('Resume'),
    Company = mongoose.model('Company'),
    Application = mongoose.model('Application'),
    expect = require('chai').expect,
    Factory = require('../factory');

describe('Resume', function () {
    function clearData() {
        Resume.remove().exec();
        Company.remove().exec();
        Application.remove().exec();
    }

    beforeEach(function (done) {
        clearData();
        done();
    });

    after(function (done) {
        clearData();
        done();
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