'use strict';

var expect = require('chai').expect,
  Factory = require('../factory'),
  helper = require('../testHelper');

describe('counts', function () {

  var user, request;

  beforeEach(function (done) {
    helper.clearCollections('Company', 'User', 'Role','Resume', 'Interview', function () {

      helper.login(function (agent, createdUser) {
        request = agent;
        user = createdUser;
        Factory.create('user', function (user2) {
          Factory.build('resume', {company: user.company, status: 'new'}, function (newResume) {
            newResume.saveAndIndexSync(function () {

              Factory.build('resume', {company: user.company, status: 'undetermined'}, function (newResume) {
                newResume.saveAndIndexSync(function () {

                  Factory.build('resume', {company: user.company, status: 'pursued'}, function (newResume) {
                    newResume.saveAndIndexSync(function () {

                      Factory.create('interview', { company: user.company,
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


  it('should get counts correctly', function (done) {
    request.get('/api/counts?counts=new&counts=pursued&counts=undetermined&counts=unreviewed&counts=interviews&counts=eventsOfToday&counts=onboards')
      .expect(200)
      .expect('content-type', /json/)
      .end(function (err, res) {
        expect(res.body.new).to.equal(1);
        expect(res.body.pursued).to.equal(1);
        expect(res.body.undetermined).to.equal(1);
        expect(res.body.unreviewed).to.equal(0);
        expect(res.body.interviews).to.equal(1);
        expect(res.body.eventsOfToday).to.equal(1);
        expect(res.body.onboards).to.equal(0);
        done(err);
      });
  });
});