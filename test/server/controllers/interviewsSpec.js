'use strict';

var helper = require('../testHelper'),
  Factory = require('../factory'),
  expect = require('chai').expect,
  Interview = require('mongoose').model('Interview');

describe('interviews', function () {
  var user, resume, request, interview;

  beforeEach(function (done) {
    helper.clearCollections('Company', 'User', 'Interview', 'Resume', function () {
      helper.login(function (agent, createdUser) {
        Factory.create('resume', function (createdResume) {
          resume = createdResume;
          user = createdUser;
          request = agent;
          Factory.create('interview', {
            company: user.company,
            events: [
              {
                startTime: new Date(),
                duration: 90,
                interviewers: [user._id],
                createdBy: user._id
              }
            ]
          }, function (createdInterview) {
            interview = createdInterview;
            done();
          });
        });
      });
    });
  });

  describe('GET /api/interviews?status=unprocess', function () {
    it('should get back a list of interviews', function (done) {
      request.get('/api/interviews?status=unprocessed')
        .expect('Content-type', /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.length(1);
          done();
        });
    });
  });

  describe('get /api/interviews/:id', function () {
    it('should return one interview', function (done) {
      request.get('/api/interviews/' + interview._id)
        .expect('Content-type', /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res.body).to.have.property('_id');
          expect(res.body.events[0].interviewers[0]).to.have.property('name');
          done();
        });
    });

  });

  describe('put /api/interview/:id', function () {
    it('should save successfully', function (done) {
      request.put('/api/interviews/' + interview._id)
        .send({
          review: {
            comment: 'This guy is awesome!!!',
            qualified: true,
            items: [
              { name: '学习能力', rate: 1, score: 4 },
              {name: '工作态度', rate: 1, score: 3},
              {name: '团队合作', rate: 1, score: 5}
            ]}
        })
        .expect(200, function () {
          Interview.findById(interview._id, function (err, newInterview) {
            expect(newInterview.reviews).to.have.length(1);
            expect(newInterview.reviews[0].items).to.have.length(3);
            expect(newInterview.reviews[0].interviewer.toString()).to.equal(user.id);
            done();
          });
        });
    });
  });
});