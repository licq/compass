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

        expect($scope.evaluationCriterion.items).to.exist;
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

    it('should remove the corresponding item', function () {
        $httpBackend.expectGET('/api/evaluationCriterions').respond({company: 'company', items: [
            {
                name: '主动性',
                rate: 0.5
            }
        ]});
        $httpBackend.flush();

        $scope.remove({rowIndex: 0});
        expect($scope.evaluationCriterion.items).to.have.length(0);
    });

    it('should add one row to items', function () {
        $httpBackend.expectGET('/api/evaluationCriterions').respond({company: 'company', items: [
            {
                name: '主动性',
                rate: 0.5
            }
        ]});

        $httpBackend.flush();

        $scope.add();
        expect($scope.evaluationCriterion.items).to.have.length(2);
        expect($scope.evaluationCriterion.items[1].name).to.equal('双击进行修改');
        expect($scope.evaluationCriterion.items[1].rate).to.equal(1);
    });

    it('should PUT /api/evaluationCriterions', inject(function (mvNotifier) {
        $httpBackend.expectGET('/api/evaluationCriterions').respond({company: 'company', items: [
            {
                name: '主动性',
                rate: 0.5
            }
        ]});
        $httpBackend.flush();

        var items = [
            {
                name: '主动性',
                rate: 0.5
            }
        ];

        var spy = sinon.spy(mvNotifier, 'notify');
        $httpBackend.expectPUT('/api/evaluationCriterions', {items: items, company: 'company'}).respond(200);
        $scope.evaluationCriterion.items = items;
        $scope.save();
        $httpBackend.flush();
        expect(spy).to.have.been.calledWith('修改保存成功');
    }));

    it('should show error if put /api/evaluationCriterions failed', inject(function (mvNotifier) {
        $httpBackend.expectGET('/api/evaluationCriterions').respond({company: 'company', items: [
            {
                name: '主动性',
                rate: 0.5
            }
        ]});
        $httpBackend.flush();

        var items = [
            {
                name: '主动性',
                rate: 0.5
            }
        ];

        var spy = sinon.spy(mvNotifier, 'error');
        $httpBackend.expectPUT('/api/evaluationCriterions', {items: items, company: 'company'}).respond(500);
        $scope.evaluationCriterion.items = items;
        $scope.save();
        $httpBackend.flush();
        expect(spy).to.have.been.calledWith('修改保存失败');
    }));

});