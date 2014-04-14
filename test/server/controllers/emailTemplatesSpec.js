'use strict';

var app = require('../../../server'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    expect = require('chai').expect,
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    EmailTemplate = mongoose.model('EmailTemplate'),
    Factory = require('../factory'),
    helper = require('./helper');


describe('users', function () {
    var cookies,
        emailTemplate,
        user;

    function cleanData() {
        User.remove().exec();
        Company.remove().exec();
        EmailTemplate.remove().exec();
    }

    beforeEach(function (done) {
        cleanData();
        Factory.create('user', function (createdUser) {
            user = createdUser;
            Factory.create('emailTemplate', {createdBy: user._id, company: user.company}, function (et) {
                emailTemplate = et;
                helper.login(user, function (cks) {
                    cookies = cks;
                    done();
                });
            });
        });
    });

    after(function (done) {
        cleanData();
        done();
    });

    describe('POST /api/emailTemplates', function () {
        it('should return 200 with json result', function (done) {
            var req = request(app).post('/api/emailTemplates');
            req.cookies = cookies;
            Factory.build('emailTemplate', function (emailTemplate) {
                req.send({
                    name: emailTemplate.name,
                    subject: emailTemplate.subject,
                    content: emailTemplate.content,
                }).expect(200)
                    .end(function (err) {
                        done(err);
                    });
            });
        });
    });

    describe('GET /api/emailTemplates', function () {
        it('should return 200 with json result', function (done) {
            var req = request(app).get('/api/emailTemplates');
            req.cookies = cookies;
            req.expect(200)
                .expect('content-type', /json/)
                .end(function (err, res) {
                    expect(res.body).to.have.length(1);
                    done(err);
                });
        });
    });

    describe('DELETE /api/emailTemplates/:id', function () {
        it('should return 200', function (done) {
            var req = request(app).del('/api/emailTemplates/' + emailTemplate._id);
            req.cookies = cookies;
            req.expect(200)
                .end(done);
        });
    });

    describe('GET /api/emailTemplates/:id', function () {
        it('should return 200 with json result', function (done) {
            var req = request(app).get('/api/emailTemplates/' + emailTemplate._id);
            req.cookies = cookies;
            req.expect(200)
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
            var req = request(app).put('/api/emailTemplates/' + emailTemplate._id);
            req.cookies = cookies;
            req.send({
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


