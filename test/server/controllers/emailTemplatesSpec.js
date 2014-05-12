'use strict';

var expect = require('chai').expect,
  Factory = require('../factory'),
  helper = require('../testHelper'),
  EmailTemplate = require('mongoose').model('EmailTemplate');

describe('emailTemplates', function () {
  var request,
    emailTemplate;

  beforeEach(function (done) {
    helper.clearCollections('User', 'Company', 'EmailTemplate', function () {
      helper.login(function (agent, user) {
        request = agent;
        Factory.create('emailTemplate', {createdBy: user._id, company: user.company}, function (et) {
          emailTemplate = et;
          done();
        });
      });
    });
  });

  describe('POST /api/emailTemplates', function () {
    it('should return 200 with json result', function (done) {
      Factory.build('emailTemplate', function (emailTemplate) {
        request.post('/api/emailTemplates')
          .send({
            name: emailTemplate.name,
            subject: emailTemplate.subject,
            content: emailTemplate.content,
          }).expect(200, done);
      });
    });
  });

  describe('GET /api/emailTemplates', function () {
    it('should return 200 with json result', function (done) {
      request.get('/api/emailTemplates')
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(res.body).to.have.length(1);
          var et = res.body[0];
          expect(et).to.have.property('subject');
          expect(et).to.have.property('content');
          done(err);
        });
    });
  });

  describe('GET /api/emailTemplates?fields=name', function () {
    it('should return 200 with json result', function (done) {
      request.get('/api/emailTemplates?fields=name')
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(res.body).to.have.length(1);
          var et = res.body[0];
          expect(et).to.not.have.property('subject');
          expect(et).to.not.have.property('content');
          done(err);
        });
    });
  });

  describe('DELETE /api/emailTemplates/:id', function () {
    it('should return 200', function (done) {
      request.del('/api/emailTemplates/' + emailTemplate._id)
        .expect(200, done);
    });
  });

  describe('GET /api/emailTemplates/:id', function () {
    it('should return 200 with json result', function (done) {
      request.get('/api/emailTemplates/' + emailTemplate._id)
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.have.property('_id', emailTemplate._id.toString());
          done();
        });
    });
  });

  describe('PUT /api/emailTemplates/:id', function () {
    it('should return 200 with correct data', function (done) {
      request.put('/api/emailTemplates/' + emailTemplate._id)
        .send({
          name: 'change to another name',
          content: 'new content',
          subject: 'new subject'
        })
        .expect(200)
        .end(function (err) {
          expect(err).to.not.exist;
          EmailTemplate.findOne({_id: emailTemplate._id}, function (err, loaded) {
            expect(loaded).to.have.property('content', 'new content');
            expect(loaded).to.have.property('subject', 'new subject');
            done();
          });
        });
    });
  });
});