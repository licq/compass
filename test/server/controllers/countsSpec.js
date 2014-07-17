'use strict';

var expect = require('chai').expect,
  Factory = require('../factory'),
  helper = require('../testHelper');

describe('counts', function () {

  var user, user2, request;

  beforeEach(function (done) {
    helper.clearCollections('Company', 'User', 'Role', 'Resume', 'Interview', 'Position', function () {
      helper.login(function (agent, createdUser) {
        request = agent;
        user = createdUser;
        Factory.create('user', function (u) {
          user2 = u;
          Factory.build('resume', {company: user.company, status: 'new', applyPosition: '销售主管'}, function (newResume) {
            newResume.saveAndIndexSync(function () {

              Factory.build('resume', {company: user.company, status: 'undetermined', applyPosition: '销售主管'}, function (newResume) {
                newResume.saveAndIndexSync(function () {

                  Factory.build('resume', {company: user.company, status: 'pursued', applyPosition: '销售主管'}, function (newResume) {
                    newResume.saveAndIndexSync(function () {
                      Factory.create('interview', { company: user.company, applyPosition: '销售主管',
                        'reviews': [
                          {'totalScore': 18, 'comment': 'average', 'qualified': true, 'interviewer': user._id,
                            'items': [
                              {'name': '专业知识', 'rate': 1, 'score': 3}
                            ]},
                          {'totalScore': 8, 'comment': 'excellent', 'qualified': false,
                            'interviewer': user2._id,
                            'items': [
                              {'name': '专业知识', 'rate': 1, 'score': 3}
                            ]},
                          {'totalScore': 28, 'comment': 'excellent', 'qualified': false,
                            'interviewer': user2._id,
                            'items': [
                              {'name': '专业知识', 'rate': 1, 'score': 3}
                            ]}

                        ],
                        'events': [
                          {'duration': 60, 'startTime': new Date(),
                            'createdBy': user._id, 'interviewers': [user._id]},
                          {'duration': 60, 'startTime': new Date(),
                            'createdBy': user._id, 'interviewers': [user._id]}
                        ]}, function () {
                        Factory.create('interview', { company: user.company, applyPosition: '销售主管', status: 'offer accepted',
                          'events': [
                            {'duration': 60, 'startTime': new Date(),
                              'createdBy': user2._id, 'interviewers': [user2._id]},
                            {'duration': 60, 'startTime': new Date(),
                              'createdBy': user2._id, 'interviewers': [user2._id]}
                          ],
                          'onboardDate': new Date()}, function () {
                          done();
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  it('should get counts correctly for user without positions', function (done) {
    request.get('/api/counts?counts=new&counts=pursued&counts=undetermined&counts=unreviewed&counts=interviews&counts=eventsOfToday&counts=onboards')
      .expect(200)
      .expect('content-type', /json/)
      .end(function (err, res) {
        console.log(res.body);
        expect(res.body.new).to.equal(1);
        expect(res.body.pursued).to.equal(1);
        expect(res.body.undetermined).to.equal(1);
        expect(res.body.unreviewed).to.equal(0);
        expect(res.body.eventsOfToday).to.equal(2);
        expect(res.body.onboards).to.equal(1);
        done(err);
      });
  });

  it('should get counts correctly for user with positions', function (done) {
    helper.createPosition({owners: [user], name: '销售主管'}, function () {
      request.get('/api/counts?counts=new&counts=pursued&counts=undetermined&counts=unreviewed&counts=interviews&counts=eventsOfToday&counts=onboards')
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          console.log(res.body);
          expect(res.body.new).to.equal(1);
          expect(res.body.pursued).to.equal(1);
          expect(res.body.undetermined).to.equal(1);
          expect(res.body.unreviewed).to.equal(0);
          expect(res.body.eventsOfToday).to.equal(2);
          expect(res.body.onboards).to.equal(1);
          done(err);
        });
    });
  });

  it('should get counts correctly', function (done) {
    helper.createPosition({owners: [user], name: '财务总监cfo'}, function () {
      request.get('/api/counts?counts=new&counts=pursued&counts=undetermined&counts=unreviewed&counts=interviews&counts=eventsOfToday&counts=onboards')
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(res.body.new).to.equal(0);
          expect(res.body.pursued).to.equal(0);
          expect(res.body.undetermined).to.equal(0);
          expect(res.body.unreviewed).to.equal(0);
          expect(res.body.eventsOfToday).to.equal(2);
          expect(res.body.onboards).to.equal(0);
          done(err);
        });
    });
  });
});