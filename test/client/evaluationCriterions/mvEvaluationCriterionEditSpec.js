describe('mvEvaluationCriterionEditCtrl', function () {
    beforeEach(module('compass'));

    var $httpBackend,
        mvEvaluationCriterionEditCtrl,
        $scope;

    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $scope = $rootScope.$new();
        mvEvaluationCriterionEditCtrl = $controller('mvEvaluationCriterionEditCtrl', {
            $scope: $scope
        });
    }));

    it('should get the evaluationCriterion', function () {
        $httpBackend.expectGET('/api/evaluationCriterions').respond({company: 'company', items: [
            {
                name: '主动性',
                rate: 0.5
            }
        ]});
        $httpBackend.flush();

        expect($scope.evaluationCriterion).to.exist;
        expect($scope.evaluationCriterion.company).equal('company');
    });

    it('should set defaults if no evaluationCriterion returned', function () {
        $httpBackend.expectGET('/api/evaluationCriterions').respond(404);
        $httpBackend.flush();

        var criterion = $scope.evaluationCriterion;
        expect(criterion.items).to.have.length(6);
        expect(criterion.items[0].name).to.equal('专业知识');
        expect(criterion.items[1].name).to.equal('工作能力');
        expect(criterion.items[2].name).to.equal('工作态度');
        expect(criterion.items[3].name).to.equal('主动性');
        expect(criterion.items[4].name).to.equal('学习能力');
        expect(criterion.items[5].name).to.equal('团队合作');
        expect(criterion.items[0].rate).to.equal(1);
    });

    it('should show error if returned 500', function () {
        $httpBackend.expectGET('/api/evaluationCriterions').respond(500, {message: 'error message'});
        $httpBackend.flush();

        expect($scope.err).to.exist;
    });

    it('should set the crumbs to settings evaluationCriterions', function () {
        expect($scope.crumbs).to.have.length(2);
        expect($scope.crumbs[1]).to.have.property('text', '面试评价');
    });
});