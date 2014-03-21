'use strict';

var mongoose = require('mongoose'),
    Mail = mongoose.model('Mail'),
    Company = mongoose.model('Company'),
    expect = require('chai').expect,
    Factory = require('../factory');

describe('Mail', function () {

    after(function (done) {
        Mail.remove().exec();
        done();
    });

    describe('#validate', function () {
        it('should begin with no mails', function (done) {
            Mail.find({}, function (err, mails) {
                expect(mails).have.length(0);
                done();
            });
        });

        it('should be able to save without problems', function (done) {
            Factory.build('mail', function (mail) {
                mail.save(function (err, saved) {
                    expect(err).to.not.exist;
                    expect(saved).to.have.property('from');
                    expect(saved.to).to.exist;
                    expect(saved.subject).to.exist;
                    expect(saved.html).to.exist;
                    expect(saved.date).to.exist;
                    expect(saved.created_at).to.exist;
                    expect(saved.updated_at).to.exist;
                    done();
                });
            });
        });


        it('should show an error when try to save empty mail', function (done) {
            new Mail().save(function (err) {
                expect(err).to.exist;
                expect(err.errors).to.have.property('from');
                expect(err.errors).to.have.property('email');
                done();
            });
        });
    });
});
