var mongoose = require('mongoose'),
    EvaluationCriterion = mongoose.model('EvaluationCriterion'),
    Company = mongoose.model('Company'),
    Factory = require('../factory'),
    expect = require('chai').expect,
    helper = require('../databaseHelper');

describe('EvaluationCriterion', function () {
    var criterionData;
    beforeEach(function (done) {
        var items = [
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
        ];
        helper.clearCollections(Company, EvaluationCriterion, function () {
            Factory.create('company', function (company) {
                criterionData = {
                    items: items,
                    company: company._id
                };
                done();
            });
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

    it('should find the created one', function (done) {
        EvaluationCriterion.create(criterionData, function () {
            EvaluationCriterion.findOrCreate(criterionData.company, function (err, criterion) {
                expect(err).to.not.exist;
                expect(criterion).to.exist;
                done();
            });
        });
    });

    it('should create a new one when no exist', function (done) {
        EvaluationCriterion.findOrCreate(criterionData.company, function (err, criterion) {
            expect(err).to.not.exist;
            expect(criterion).to.exist;
            expect(criterion.items).to.have.length(6);
            done();
        });
    });
});
