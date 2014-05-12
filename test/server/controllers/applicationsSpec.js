'use strict';

var app = require('../../../server'),
  request = require('supertest'),
  mongoose = require('mongoose'),
  expect = require('chai').expect,
  User = mongoose.model('User'),
  Company = mongoose.model('Company'),
  Resume = mongoose.model('Resume'),
  Factory = require('../factory'),
  helper = require('./helper'),
  databaseHelper = require('../databaseHelper');


describe('applications', function () {
  var cookies,
    resume,
    user;

  beforeEach(function (done) {
    databaseHelper.clearCollections(User, Company,
      Resume, function () {
        Factory.create('user', function (createdUser) {
          user = createdUser;
          Factory.build('resume', {company: user.company}, function (newResume) {
            newResume.saveAndIndexSync(function () {
              helper.login(user, function (cks) {
                cookies = cks;
                resume = newResume;
                done();
              });
            });
          });
        });
      });
  });

  describe('GET /api/applications?status=new&pageSize=10&page=1', function () {
    it('should return 200 with json result', function (done) {
      var req = request(app).get('/api/applications?status=new&pageSize=10&page=1');
      req.cookies = cookies;
      req.expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          var result = res.body;
          expect(result.hits.total).to.equal(1);
          expect(result.hits.hits).to.have.length(1);
          expect(result.facets.age).to.exist;
          expect(result.facets.highestDegree).to.exist;
          expect(result.facets.applyPosition).to.exist;
          done(err);
        });
    });
  });

  describe('GET /api/applications/:id', function () {
    it('should return a resume', function (done) {
      var req = request(app).get('/api/applications/' + resume._id);
      req.cookies = cookies;
      req.expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          console.log(err);
          var result = res.body;
          expect(result).to.have.property('_id');
          done(err);
        });
    });
  });

  describe('PUT /api/applications/:id', function () {
    it('should set status to archived', function (done) {
      var req = request(app).put('/api/applications/' + resume._id + '?status=archived');
      req.cookies = cookies;
      req.expect(200)
        .end(function (err) {
          expect(err).to.not.exist;
          Resume.findById(resume._id, function (err, resume) {
            expect(err).to.not.exist;
            expect(resume.status).to.equal('archived');
            done();
          });
        });
    });
    it('should set status to pursued', function (done) {
      var req = request(app).put('/api/applications/' + resume._id + '?status=pursued');
      req.cookies = cookies;
      req.expect(200)
        .end(function (err) {
          expect(err).to.not.exist;
          Resume.findById(resume._id, function (err, resume) {
            expect(err).to.not.exist;
            expect(resume.status).to.equal('pursued');
            done();
          });
        });
    });

    it('should set status to undetermined', function (done) {
      var req = request(app).put('/api/applications/' + resume._id + '?status=undetermined');
      req.cookies = cookies;
      req.expect(200)
        .end(function (err) {
          expect(err).to.not.exist;
          Resume.findById(resume._id, function (err, resume) {
            expect(err).to.not.exist;
            expect(resume.status).to.equal('undetermined');
            done();
          });
        });
    });

    it('should set status to archived', function (done) {
      var req = request(app).put('/api/applications/' + resume._id + '?status=archived');
      req.cookies = cookies;
      req.expect(200)
        .end(function (err) {
          expect(err).to.not.exist;
          Resume.findById(resume._id, function (err, resume) {
            expect(err).to.not.exist;
            expect(resume.status).to.equal('archived');
            done();
          });
        });
    });
  });
});


