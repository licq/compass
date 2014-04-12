'use strict';

var mongoose = require('mongoose'),
    EmailTemplate = mongoose.model('EmailTemplate'),
    Company = mongoose.model('Company'),
    User = mongoose.model('User'),
    expect = require('chai').expect,
    Factory = require('../factory');

describe.only('EmailTemplate', function () {

    describe('#create', function () {
        it('should show errors if with empty arguments', function (done) {
            new EmailTemplate().save(function (err) {
                expect(err).to.exist;
                expect(err.errors.company).to.have.property('type', 'required');
                expect(err.errors.subject).to.have.property('type', 'required');
                expect(err.errors.content).to.have.property('type', 'required');
                expect(err.errors.name).to.have.property('type', 'required');
                expect(err.errors.createdBy).to.have.property('type', 'required');
                done();
            });
        });

        it('should create an emailTemplate', function (done) {
            Factory.build('emailTemplate', function (emailTemaplte) {
                emailTemaplte.save(function (err, saved) {
                    expect(err).to.not.exist;
                    expect(saved.created_at).to.exist;
                    done();
                });
            });
        });

        it('should show error if the company already have the same emailTemplate', function (done) {
            Factory.create('emailTemplate', function (emailTemplate) {
                Factory.build('emailTemplate', {name: emailTemplate.name, company: emailTemplate.company}, function (newEmailTemplate) {
                    newEmailTemplate.save(function (err) {
                        expect(err).to.exist;
                        expect(err.code).to.equal(11000);
                        done();
                    });
                });
            });
        });

        it('should create successfully if the other company have the same emailTemplate', function (done) {
            Factory.create('emailTemplate', function (emailTemplate) {
                Factory.build('emailTemplate', {name: emailTemplate.name}, function (newEmailTemplate) {
                    newEmailTemplate.save(function (err) {
                        expect(err).to.not.exist;
                        done();
                    });
                });
            });
        });


    });

    beforeEach(function (done) {
        removeAllRelated(done);
    });

    after(function (done) {
        removeAllRelated(done);
    });

    function removeAllRelated(cb) {
        Company.remove().exec();
        User.remove().exec();
        EmailTemplate.remove().exec();
        cb();
    }
});

