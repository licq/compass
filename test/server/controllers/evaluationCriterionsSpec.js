'use strict';

var expect = require('chai').expect,
  EvaluationCriterion = require('mongoose').model('EvaluationCriterion'),
  helper = require('../testHelper');

describe('evaluationCriterion', function () {
  var request,
    user,
    evaluationCriterion;

  beforeEach(function (done) {
    helper.clearCollections('User', 'Company', 'Role','EvaluationCriterion', function () {
      helper.login(function (agent, createdUser) {
        user = createdUser;
        request = agent;
        EvaluationCriterion.create({company: user.company, items: [
          {
            name: '工作态度', rate: 1
          }
        ]}, function (ec) {
          evaluationCriterion = ec;
          done();
        });
      });
    });
  });

  describe('GET /api/evaluationCriterions', function () {
    it('should return 200 with json result', function (done) {
      request.get('/api/evaluationCriterions')
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          var ec = res.body;
          expect(ec.items).to.have.length(1);
          done(err);
        });
    });
  });


  describe('PUT /api/evaluationCriterions', function () {
    it('should return 200', function (done) {
      var items = [
        { name: '工作态度', rate: 1 }
      ];
      request.put('/api/evaluationCriterions')
        .send({
          items: items,
          company: user.company
        })
        .expect(200, done);
    });
  });
});