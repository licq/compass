describe('mvPositionNewCtrl', function () {
  var $httpBackend,
    $scope,
    mvPositionNewCtrl;

  beforeEach(module('compass'));
  describe('#create', function () {

    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
      $httpBackend = _$httpBackend_;
      $scope = $rootScope.$new();
      $httpBackend.expectGET('/api/users').respond([
        {'_id': '4466', 'name': '张三'},
        {'_id': '5577', 'name': '李四'}
      ]);
      mvPositionNewCtrl = $controller('mvPositionNewCtrl', {
        $scope: $scope
      });
      $httpBackend.flush();
    }));

    describe('create position', function () {
      var positionData;
      beforeEach(function () {
        positionData = {
          name: 'cio',
          department:'技术部',
          owners: ['张三', '李四'],
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

        _.merge($scope.position, positionData);
      });

      it('should go to success page when create success', inject(function ($location, mvNotifier) {
        $httpBackend.expectPOST('/api/positions', positionData).respond(200);
        var spy = sinon.spy($location, 'path');
        var notifySpy = sinon.spy(mvNotifier, 'notify');
        $scope.create();
        $httpBackend.flush();
        expect(spy).to.have.been.calledWith('/settings/positions');
        expect(notifySpy).to.have.been.calledWith('添加职位成功');
      }));

      it('should show error if create failed', inject(function (mvNotifier) {
        $httpBackend.expectPOST('/api/positions', positionData).respond(500, {message: 'error'});
        var notifySpy = sinon.spy(mvNotifier, 'error');
        $scope.create();
        $httpBackend.flush();
        expect(notifySpy).to.have.been.calledWith('添加职位失败');
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
});