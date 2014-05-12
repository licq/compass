'use strict';

var
  Mail = require('mongoose').model('Mail'),
  expect = require('chai').expect,
  Factory = require('../factory'),
  helper = require('../testHelper');

describe('Mail', function () {

  beforeEach(function (done) {
    helper.clearCollections(Mail, 'Company', 'Email', done);
  });

  describe('#validate', function () {
    it('should begin with no mails', function (done) {
      Mail.find(function (err, mails) {
        expect(mails).have.length(0);
        done();
      });
    });

    it('should be able to save without problems', function (done) {
      Factory.build('mail', function (mail) {
        mail.save(function (err, saved) {
          expect(err).to.not.exist;
          expect(saved.from).to.exist;
          expect(saved.to).to.exist;
          expect(saved.subject).to.exist;
          expect(saved.mailbox).to.exist;
          expect(saved.html).to.exist;
          expect(saved.date).to.exist;
          expect(saved.created_at).to.exist;
          expect(saved.updated_at).to.exist;
          done();
        });
      });
    });

    it('should associate one company', function (done) {
      Factory.create('company', function (company) {
        Factory.create('email', {company: company._id}, function (email) {
          Factory.create('mail', {mailbox: email.address}, function (mail) {
            expect(mail.company.equals(company._id)).to.be.true;
            expect(mail.fromName).to.equal(mail.from[0].name);
            expect(mail.fromAddress).to.equal(mail.from[0].address);
            done();
          });
        });
      });
    });


    it('should show an error when try to save empty mail', function (done) {
      new Mail().save(function (err) {
        expect(err).to.exist;
        expect(err.errors).to.have.property('from');
        expect(err.errors).to.have.property('mailbox');
        done();
      });
    });
  });
});
