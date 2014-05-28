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

    $httpBackend.expectGET('/api/evaluationCriterions').respond({company: 'company', items: [
      {
        name: '主动性',
        rate: 0.5
      }
    ]});
    $httpBackend.flush();
  }));

  it('should get the evaluationCriterion', function () {
    expect($scope.evaluationCriterion.items).to.exist;
  });

  describe('remove', function () {
    it('should remove the corresponding item', function () {
      $scope.remove({
        name: '主动性',
        rate: 0.5
      });
      expect($scope.evaluationCriterion.items).to.have.length(0);
    });
  });

  describe('add', function () {
    it('should add set adding to true', function () {
      $scope.add();
      expect($scope.adding).to.equal(true);
    });
  });

  describe('create', function () {
    it('should add one row to items', function () {
      $scope.item = {
        name: '学习能力',
        rate: 0.5
      };
      $scope.create();
      expect($scope.adding).to.equal(false);
      expect($scope.item).to.be.empty;
      expect($scope.evaluationCriterion.items).to.have.length(2);
    });
  });

  describe('cancel', function () {
    it('should change adding to false', function () {
      $scope.adding = true;
      $scope.cancel();
      expect($scope.adding).to.false;
      expect($scope.evaluationCriterion.items).to.have.length(1);
    });
  });

  it('should PUT /api/evaluationCriterions', inject(function (mvNotifier) {
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