var mongoose = require('mongoose'),
    EvaluationCriterion = mongoose.model('EvaluationCriterion'),
    Company = mongoose.model('Company'),
    Factory = require('../factory'),
    _ = require('lodash'),
    expect = require('chai').expect;


describe('EvaluationCriterion', function () {
    var criterionData;
    beforeEach(function (done) {
        clearData();
        Factory.create('company', function (company) {
            criterionData = {
                criterions: [
                    {
                        name: '工作能力',
                        rate: 0.3
                    },
                    {
                        name: '态度',
                        rate: 0.3
                    },
                    {
                        name: '学习能力',
                        rate: 0.2
                    }
                ],
                company: company._id
            };
            done();
        });
    });

    describe('#validation', function () {
        it('should create successfully', function (done) {
            var evaluationCriterion = new EvaluationCriterion(criterionData);
            evaluationCriterion.save(done);
        });

        it('should have errors when with no arguments', function (done) {
            new EvaluationCriterion().save(function (err) {
                expect(err).to.exist;
                expect(err.errors.company).to.exist;
                done();
            });
        });
    });

    after(function (done) {
        clearData();
        done();
    });

    function clearData() {
        Company.remove().exec();
        EvaluationCriterion.remove().exec();
    }
});
