'use strict';

var helper = require('../testHelper'),
    Factory = require('../factory'),
    expect = require('chai').expect;

describe.only('interviews', function () {

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
            request.put('/api/interviews' + interview._id, interview)
                .expect(300);
           done();
        });

    });
});