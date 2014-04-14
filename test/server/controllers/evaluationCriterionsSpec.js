'use strict';

var app = require('../../../server'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    expect = require('chai').expect,
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    EvaluationCriterion = mongoose.model('EvaluationCriterion'),
    Factory = require('../factory'),
    helper = require('./helper');


describe('evaluationCriterion', function () {
    var cookies,
        evaluationCriterion,
        user;

    function cleanData() {
        User.remove().exec();
        Company.remove().exec();
        EvaluationCriterion.remove().exec();
    }

    beforeEach(function (done) {
        cleanData();
        Factory.create('user', function (createdUser) {
            user = createdUser;
            EvaluationCriterion.create({company: user.company, items: [
                {
                    name: '工作态度', rate: 1
                }
            ]}, function (ec) {
                evaluationCriterion = ec;
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

    describe('GET /api/evaluationCriterions', function () {
        it('should return 200 with json result', function (done) {
            var req = request(app).get('/api/evaluationCriterions');
            req.cookies = cookies;
            req.expect(200)
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
            var req = request(app).put('/api/evaluationCriterions');
            req.cookies = cookies;
            req.send({
                items: items,
                company: user.company
            })
                .expect(200)
                .end(function (err) {
                    expect(err).to.not.exist;
                    done();
                });
        });
    });
});


