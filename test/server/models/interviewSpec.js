'use strict';

var mongoose = require('mongoose'),
  expect = require('chai').expect,
  Factory = require('../factory'),
  Resume = mongoose.model('Resume'),
  moment = require('moment'),
  Interview = mongoose.model('Interview'),
  helper = require('../testHelper');

describe('interview', function () {
  var user,
    resume;

  beforeEach(function (done) {
    helper.clearCollections('Company', 'User', Resume, Interview, function () {
      Factory.create('user', function (createdUser) {
        Factory.create('resume', function (createdResume) {
          user = createdUser;
          resume = createdResume;
          done();
        });
      });
    });
  });

  describe('create', function () {
    it('should create successfully', function (done) {
      Factory.build('interview', {events: [
        {interviewers: [user.id],
          startTime: new Date(),
          duration: 90,
          createdBy: user}
      ]}, function (interview) {
        interview.save(function (err) {
          expect(err).to.not.exist;
          done();
        });
      });
    });

    it('should create interview when no related interview', function (done) {
      Interview.addEvent({
        startTime: new Date(),
        interviewers: [user.id],
        application: resume._id,
        company: user.company,
        createdBy: user._id,
        duration: 90
      }, function (err) {
        expect(err).to.not.exist;
        Interview.findOne({company: user.company, application: resume._id})
          .exec(function (err, interview) {
            expect(err).to.not.exist;
            expect(interview).to.exist;
            expect(interview).to.have.property('company');
            done();
          });
      });
    });

    it('should add to events when related interview existed', function (done) {
      Factory.create('interview', {events: [
        {
          startTime: new Date(),
          duration: 90,
          interviewers: [user.id],
          createdBy: user.id
        }
      ]}, function (createdInterview) {
        Interview.addEvent({
          startTime: new Date(),
          interviewers: [user.id],
          application: createdInterview.application,
          company: createdInterview.company,
          createdBy: user._id,
          duration: 90
        }, function (err, interview) {
          expect(err).to.not.exist;
          expect(interview.id).to.equal(createdInterview.id);
          expect(interview.events).to.have.length(2);
          done();
        });
      });
    });

    it('should change application status to interview', function (done) {
      Factory.create('resume', {status: 'pursued'}, function (resume) {
        Interview.addEvent({application: resume, interviewers: [user.id],
          createdBy: user,
          company: user.company,
          startTime: new Date(),
          duration: 90
        }, function (err) {
          expect(err).to.not.exist;
          Resume.findById(resume._id, function (err, re) {
            expect(re.status).to.equal('interview');
            done();
          });
        });
      });
    });
  });

  describe('validation', function () {
    it('should return errors when with no arguments', function (done) {
      Interview.addEvent({}, function (err) {
        expect(err).to.exist;
        expect(err.errors).to.have.property('events.0.interviewers');
        expect(err.errors).to.have.property('events.0.createdBy');
        expect(err.errors).to.have.property('events.0.duration');
        expect(err.errors).to.have.property('events.0.startTime');
        done();
      });
    });

    it('should return interview company and application errors', function (done) {
      Interview.addEvent({startTime: new Date(),
        duration: 60,
        createdBy: user,
        interviewers: [user]
      }, function (err) {
        expect(err).to.exist;
        expect(err.errors).to.have.property('company');
        expect(err.errors).to.have.property('application');
        done();
      });
    });
  });

  describe('events', function () {
    it('should get all related events of user', function (done) {
      var start = moment([2015, 5, 1, 7, 30, 0, 0]).toDate();
      var end = moment([2015, 5, 1, 7, 31, 0, 0]).toDate();
      Factory.create('interview', {events: [
        {
          startTime: moment([2015, 5, 1, 7, 30, 0, 0]).toDate(),
          duration: 90,
          interviewers: [user._id],
          createdBy: user._id
        }
      ]}, function (createdInterview) {
        Interview.eventsForInterviewer(user.id, start, end, function (err, events) {
          expect(err).to.not.exist;
          expect(events).to.have.length(1);
          expect(events[0].company.toString()).to.equal(createdInterview.company.toString());
          expect(events[0].application.toString()).to.equal(createdInterview.application.toString());
          done();
        });
      });
    });

    it('should get all related events of company', function (done) {
      var start = moment([2015, 5, 1, 7, 30, 0, 0]).toDate();
      var end = moment([2015, 5, 1, 7, 31, 0, 0]).toDate();
      Factory.create('user', function (anotherUser) {
        Factory.create('interview', {
          company: user.company,
          events: [
            {
              startTime: moment([2015, 5, 1, 7, 30, 0, 0]).toDate(),
              duration: 90,
              interviewers: [anotherUser._id],
              createdBy: anotherUser._id
            }
          ]}, function (createdInterview) {
          Interview.eventsForCompany(user.company, start, end, function (err, events) {
            expect(err).to.not.exist;
            expect(events).to.have.length(1);
            expect(events[0].company.toString()).to.equal(createdInterview.company.toString());
            expect(events[0].application.toString()).to.equal(createdInterview.application.toString());
            done();
          });
        });
      });
    });

    it('should update the event', function (done) {
      Factory.create('interview', {events: [
        {
          startTime: new Date(),
          duration: 90,
          interviewers: [user._id],
          createdBy: user._id,
        }
      ],company: user.company}, function (createdInterview) {
        var updatedEventData = {
          startTime: new Date(),
          duration: 60,
          interviewers: [user._id],
          company: user.company
        };
        Interview.updateEvent(createdInterview.events[0]._id, updatedEventData, function (err, interview) {
          expect(err).to.not.exist;
          expect(interview.id).to.equal(createdInterview.id);
          expect(interview.events).to.have.length(1);
          var event = interview.events[0];
          expect(event.duration).to.equal(60);
          expect(event.createdBy.toString()).to.equal(user.id);
          done();
        });
      });
    });

    it('should remove the event', function (done) {
      Factory.create('interview', {events: [
        {
          startTime: new Date(),
          duration: 90,
          interviewers: [user._id],
          createdBy: user._id,
          company: user.company
        }
      ],company: user.company}, function (createdInterview) {
        Interview.deleteEvent(createdInterview.events[0]._id, user.company, function (err, interview) {
          expect(err).to.not.exist;
          expect(interview.events).to.have.length(0);
          done();
        });
      });
    });
  });

  describe('retrieve interviews for reviews', function () {
    var anotherUser;

    beforeEach(function (done) {
      Factory.create('user', function (auser) {
        anotherUser = auser;
        done();
      });
    });

    it('should return interviews', function (done) {
      Factory.create('interview', {
        events: [
          {
            startTime: new Date(),
            duration: 90,
            interviewers: [user._id],
            createdBy: user._id
          }
        ]}, function () {
        var options = {
          page: 1,
          pageSize: 50
        };
        Interview.queryForReview(user, options, function (err, interviews) {
          expect(err).to.not.exist;
          expect(interviews).to.have.length(1);
          expect(interviews[0].reviews).to.have.length(0);
          expect(interviews[0].events).to.have.length(1);
          Interview.countForReview(user, options, function (err, count) {
            expect(err).to.not.exist;
            expect(count).to.equal(1);
            done();
          });
        });
      });
    });

    it('should return applyPositions', function (done) {
      Factory.create('interview', {
        applyPosition: '销售总监',
        events: [
          {
            startTime: new Date(),
            duration: 90,
            interviewers: [user._id],
            createdBy: user._id
          }
        ]}, function () {
        Interview.applyPositionsForUser(user, function (err, positions) {
          expect(err).to.not.exist;
          expect(positions).to.deep.equal(['销售总监']);
          done();
        });
      });
    });

    it('should return only one events', function (done) {
      Factory.create('interview', {
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
      }, function () {
        Interview.queryForReview(user, {page: 1, pageSize: 50}, function (err, interviews) {
          expect(err).to.not.exist;
          expect(interviews).to.have.length(1);
          expect(interviews[0].events).to.have.length(1);
          done();
        });
      });
    });

    it('should return no interviews when event interviewers not include the user', function (done) {
      Factory.create('user', function (anotherUser) {
        Factory.create('interview', {
            events: [
              {
                startTime: new Date(),
                duration: 90,
                interviewers: [user._id],
                createdBy: user._id
              }
            ]
          },
          function () {
            Interview.queryForReview(anotherUser, {page: 1, pageSize: 50}, function (err, interviews) {
              expect(err).to.not.exist;
              expect(interviews).to.have.length(0);
              done();
            });
          });
      });
    });

    it('should return the review of the user', function (done) {
      Factory.create('interview', {
          events: [
            {
              startTime: new Date(),
              duration: 90,
              interviewers: [user._id, anotherUser._id],
              createdBy: user._id
            }
          ],
          reviews: [
            {
              interviewer: user._id,
              totalScore: 15,
              qualified: false
            }
          ]
        },
        function () {
          Interview.queryForReview(anotherUser, {page: 1, pageSize: 50}, function (err, interviews) {
            expect(err).to.not.exist;
            expect(interviews).to.have.length(1);
            expect(interviews[0].reviews).to.have.length(0);
            done();
          });
        });
    });

    it('should no review of the user', function (done) {
      Factory.create('interview', {
          events: [
            {
              startTime: new Date(),
              duration: 90,
              interviewers: [user._id, anotherUser._id],
              createdBy: user._id
            }
          ],
          reviews: [
            {
              interviewer: user._id,
              totalScore: 15,
              qualified: false
            }
          ]
        },
        function () {
          Interview.queryForUnreviewed(anotherUser, {orderBy: 'events[0].startTime',
            orderByReverse: false, unreviewed: true, pageSize: 3}, function (err, interviews) {
            expect(err).to.not.exist;
            expect(interviews).to.have.length(1);
            expect(interviews[0].reviews).to.have.length(1);
            done();
          });
        });
    });

    it('should return no interviews when current time is before event start time', function (done) {
      var start = moment().add(1, 'd').toDate();
      Factory.create('interview', {
        events: [
          {
            startTime: start,
            duration: 90,
            interviewers: [user._id],
            createdBy: user._id
          }
        ]
      }, function () {
        Interview.queryForReview(user, {page: 1, pageSize: 50}, function (err, interviews) {
          expect(err).to.not.exist;
          expect(interviews).to.have.length(0);
          done();
        });
      });
    });
  });

  describe('retrieve interviews for company', function () {
    var anotherUser;

    beforeEach(function (done) {
      Factory.create('user', function (auser) {
        anotherUser = auser;
        done();
      });
    });

    describe('queryNew', function () {
      beforeEach(function (done) {
        Factory.create('interview', {
          company: user.company,
          applyPosition: '人力总监',
          events: [
            {
              startTime: moment().subtract(1, 'days').toDate(),
              duration: 90,
              interviewers: [user._id],
              createdBy: user._id
            },
            {
              startTime: moment().subtract(2, 'days').toDate(),
              duration: 90,
              interviewers: [user._id],
              createdBy: user._id
            }
          ]
        }, function () {
          Factory.create('interview', {
            company: user.company,
            applyPosition: '人力总监',
            events: [
              {
                startTime: moment().subtract(1, 'days').toDate(),
                duration: 90,
                interviewers: [user._id],
                createdBy: user._id
              },
              {
                startTime: moment().add(2, 'days').toDate(),
                duration: 90,
                interviewers: [user._id],
                createdBy: user._id
              }
            ]
          }, function () {
            Factory.create('interview', {
              company: user.company,
              applyPosition: '人力总监',
              events: [
                {
                  startTime: moment().add(1, 'd').toDate(),
                  duration: 90,
                  interviewers: [user._id],
                  createdBy: user._id
                },
                {
                  startTime: moment().add(2, 'd').toDate(),
                  duration: 90,
                  interviewers: [user._id],
                  createdBy: user._id
                }
              ]
            }, function () {
              done();
            });
          });
        });
      });


      it('should return interviews with status new', function (done) {
        var options = {
          page: 1,
          pageSize: 50,
          status: 'new',
          applyPosition: ['人力总监', '市场总监']
        };
        Interview.queryNew(user.company, options, function (err, interviews) {
          expect(err).to.not.exist;
          expect(interviews).to.have.length(3);
          expect(interviews[0].applyPosition).to.be.equal('人力总监');
          expect(interviews[0].reviews).to.have.length(0);
          expect(interviews[0].events).to.have.length(2);
          Interview.countNew(user.company, options, function (err, count) {
            expect(err).to.not.exist;
            expect(count).to.equal(3);
            done();
          });
        });
      });

      it('should return only one interview with interviewStatus complete', function (done) {
        var options = {
          page: 1,
          pageSize: 50,
          status: 'new',
          applyPosition: ['人力总监', '市场总监'],
          interviewStatus: 'complete'
        };
        Interview.queryNew(user.company, options, function (err, interviews) {
          expect(err).to.not.exist;
          expect(interviews).to.have.length(1);
          Interview.countNew(user.company, options, function (err, count) {
            expect(err).to.not.exist;
            expect(count).to.equal(1);
            done();
          });
        });
      });

      it('should return only one interview with interviewStatus some', function (done) {
        var options = {
          page: 1,
          pageSize: 50,
          status: 'new',
          applyPosition: ['人力总监', '市场总监'],
          interviewStatus: 'some'
        };
        Interview.queryNew(user.company, options, function (err, interviews) {
          expect(err).to.not.exist;
          expect(interviews).to.have.length(1);
          Interview.countNew(user.company, options, function (err, count) {
            expect(err).to.not.exist;
            expect(count).to.equal(1);
            done();
          });
        });
      });
      it('should return only one interview with interviewStatus none', function (done) {
        var options = {
          page: 1,
          pageSize: 50,
          status: 'new',
          applyPosition: ['人力总监', '市场总监'],
          interviewStatus: 'none'
        };
        Interview.queryNew(user.company, options, function (err, interviews) {
          expect(err).to.not.exist;
          expect(interviews).to.have.length(1);
          Interview.countNew(user.company, options, function (err, count) {
            expect(err).to.not.exist;
            expect(count).to.equal(1);
            done();
          });
        });
      });
    });

    it('should return interviews with status offer accepted', function (done) {
      Factory.create('interview', {
        name: user.name,
        company: user.company,
        applyPosition: '销售总监',
        application: resume._id,
        onboardDate: new Date(),
        status: 'offer accepted',
        events: [
          {
            startTime: new Date(),
            duration: 90,
            interviewers: [user._id],
            createdBy: user._id
          }
        ]}, function () {
        var options = {
          page: 1,
          pageSize: 50,
          status: 'offer accepted',
          applyPosition: ['销售总监']
        };
        Interview.queryOfferAccepted(user.company, options, function (err, interviews) {
          expect(err).to.not.exist;
          expect(interviews).to.have.length(1);
          expect(interviews[0].name).to.equal(user.name);
          expect(interviews[0].applyPosition).to.equal('销售总监');
          expect(interviews[0].onboardDate).to.be.exist;
          expect(interviews[0].application).to.deep.equal(resume._id);
          expect(interviews[0].company).to.not.exist;
          expect(interviews[0].events).to.not.exist;
          done();
        });
      });
    });

    it('should return interviews with status offered', function (done) {
      Factory.create('interview', {
        name: user.name,
        company: user.company,
        applyPosition: '市场总监',
        application: resume._id,
        onboardDate: new Date(),
        status: 'offered',
        events: [
          {
            startTime: new Date(),
            duration: 90,
            interviewers: [user._id],
            createdBy: user._id
          }
        ]}, function () {
        var options = {
          page: 1,
          pageSize: 50,
          status: 'offered',
          applyPosition: '市场总监'
        };
        Interview.queryOffered(user.company, options, function (err, interviews) {
          expect(err).to.not.exist;
          expect(interviews).to.have.length(1);
          expect(interviews[0].name).to.equal(user.name);
          expect(interviews[0].applyPosition).to.equal('市场总监');
          expect(interviews[0].onboardDate).to.be.exist;
          expect(interviews[0].application).to.not.exist;
          expect(interviews[0].events).to.not.exist;
          done();
        });
      });
    });

    it('should return applyPositions', function (done) {
      Factory.create('interview', {
        company: user.company,
        applyPosition: '销售总监',
        events: [
          {
            startTime: new Date(),
            duration: 90,
            interviewers: [user._id],
            createdBy: user._id
          }
        ]}, function () {

        Interview.applyPositionsForCompany(user.company, function (err, positions) {
          expect(err).to.not.exist;
          expect(positions).to.deep.equal(['销售总监']);
          done();
        });
      });
    });
  });
});