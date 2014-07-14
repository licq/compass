describe('mvPositionEditCtrl', function () {
  beforeEach(module('compass'));

  var $httpBackend,
    mvPositionEditCtrl,
    $scope;

  var positionData = {
    _id:'7788',
    name: 'cio',
    department:'技术部',
    interviewers: ['张三', '李四'],
    evaluationCriterions: [
      {
        'name': '主动性',
        'rate': 0.5
      },
      {
        'name': '工作能力',
        'rate': 1
      }
    ]};

  beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();


    $httpBackend.expectGET('/api/users').respond([
      {'_id': '4466', 'name': '张三'},
      {'_id': '5577', 'name': '李四'}
    ]);
    $httpBackend.expectGET('/api/positions/7788').respond(positionData);
    mvPositionEditCtrl = $controller('mvPositionEditCtrl', {
      $scope: $scope,
      $routeParams: {id: '7788'}
    });
    $httpBackend.flush();
  }));

  it('should get position', function () {
    expect($scope.position).to.exist;
  });

  describe('update position', function () {
    it('should redirect to /positions if update successfully', inject(function ($location, mvNotifier) {
      var notifySpy = sinon.spy(mvNotifier, 'notify');
      $httpBackend.expectPUT('/api/positions/7788', positionData).respond(200);
      var spy = sinon.spy($location, 'path');
      $scope.update();
      $httpBackend.flush();
      expect(spy).to.have.been.calledWith('/settings/positions');
      expect(notifySpy).to.have.been.calledWith('修改职位成功');
    }));

    it('should show error if update failed', inject(function ($location, mvNotifier) {
      var notifySpy = sinon.spy(mvNotifier, 'error');
      $httpBackend.expectPUT('/api/positions/7788', positionData).respond(500, {message: 'error'});
      $scope.update();
      $httpBackend.flush();

      expect(notifySpy).to.have.been.calledWith('修改职位失败');
      expect($scope.err).to.exist;
    }));

    describe('remove', function () {
      it('should remove the corresponding item', function () {
        $scope.remove({
          name: '主动性',
          rate: 0.5
        });
        expect($scope.position.evaluationCriterions).to.have.length(1);
      });
    });

    describe('add', function () {
      it('should add set adding to true', function () {
        $scope.add();
        expect($scope.adding).to.equal(true);
      });
    });

    describe('save', function () {
      it('should add one row to items', function () {
        $scope.item = {
          name: '学习能力',
          rate: 0.5
        };
        $scope.save();
        expect($scope.adding).to.equal(false);
        expect($scope.item).to.be.empty;
        expect($scope.position.evaluationCriterions).to.have.length(3);
      });
    });

    describe('cancel', function () {
      it('should change adding to false', function () {
        $scope.adding = true;
        $scope.cancel();
        expect($scope.adding).to.false;
        expect($scope.position.evaluationCriterions).to.have.length(2);
      });
    });
  });
});