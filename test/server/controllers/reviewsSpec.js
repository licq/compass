var helper = require('../testHelper'),
  expect = require('chai').expect,
  Factory = require('../factory'),
  Interview = require('mongoose').model('Interview');

describe('reviews', function () {
  var user, resume, request, interview;

  beforeEach(function (done) {
    helper.clearCollections('Company', 'User', 'Interview', 'Resume', function () {
      helper.login(function (agent, createdUser) {
        Factory.create('user', function (anotherUser) {
          Factory.create('resume', function (createdResume) {
            resume = createdResume;
            user = createdUser;
            request = agent;
            Factory.create('interview', {
              application: resume._id,
              company: user.company,
              applyPosition: '销售总监',
              events: [
                {
                  startTime: new Date(),
                  duration: 90,
                  interviewers: [user._id],
                  createdBy: user._id
                },
                {
                  startTime: new Date(),
                  duration: 60,
                  interviewers: [anotherUser._id],
                  createdBy: user._id
                }
              ],
              reviews: [
                {
                  interviewer: user._id,
                  comment: 'good cio',
                  qualified: true
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
  });

  describe('GET /api/reviews', function () {
    it('should get back a list of reviews', function (done) {
      request.get('/api/reviews?page=1&pageSize=5')
        .expect('Content-type', /json/)
        .expect(200)
        .end(function (err, res) {
          expect(res.get('totalCount')).to.equal('1');
          expect(res.body).to.have.length(1);
          expect(res.body[0].events).to.have.length(1);
          done(err);
        });
    });
  });

  describe('POST /api/reviews', function () {
    it('should create a review of the specified interview', function (done) {
      request.post('/api/reviews')
        .send({
          review: {
            interview: interview.id,
            interviewer: user._id,
            comment: 'good cio',
            qualified: true
          }
        })
        .expect(200)
        .end(function (err) {
          expect(err).to.not.exist;
          Interview.findById(interview._id, function (err, interview) {
            expect(interview.reviews).to.have.length(2);
            done();
          });
        });
    });
  });
});
