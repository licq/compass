describe('mvPositionEditCtrl', function () {
  var $httpBackend,
    $scope,
    mvPositionNewCtrl;

  beforeEach(module('compass'));
  describe('#create', function () {

    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
      $httpBackend = _$httpBackend_;
      $scope = $rootScope.$new();

      $httpBackend.expectGET('/api/positions/toBeAdded').respond(['市场总监','销售经理']);
      $httpBackend.expectGET('/api/users?deleted=false&fields=name').respond([
        {'_id': '4466', 'name': '张三'},
        {'_id': '5577', 'name': '李四'}
      ]);
      $httpBackend.expectGET('/api/positions').respond({
        name: 'cio',
        department: 'sales',
        owners: ['5577'],
        evaluationCriterions: [
          {
            'name': '英语',
            'rate': 0.5
          }
        ]});
      $httpBackend.expectGET('/api/applicationSettings?fields=positionRightControlled').respond({positionRightControlled: false});
      mvPositionNewCtrl = $controller('mvPositionEditCtrl', {
        $scope: $scope
      });
      $httpBackend.flush();
    }));

    describe('create position', function () {
      var putData;
      beforeEach(function () {
        $scope.position.name = 'pm';
        $scope.position.department = 'marketing';
        putData = {
          name: 'pm',
          department: 'marketing',
          owners: ['4466', '5577'],
          evaluationCriterions: [
            {
              'name': '英语',
              'rate': 0.5
            },
            {
              name: '学习能力',
              rate: 3.5
            }
          ]};
      });

      it('should initialize successfully', function () {
        expect($scope.users).to.have.length(2);
        expect($scope.position.evaluationCriterions).to.have.length(1);
        expect($scope.position.owners[0]).to.equal('5577');
      });

      it('should initialize positions', function () {
        expect($scope.positions).to.have.length(3);
      });

      it('should check users correctly', function () {
        expect($scope.users[0].checked).to.be.false;
        expect($scope.users[1].checked).to.be.true;
      });

      it('should go to success page when create success', inject(function ($location, mvNotifier) {

        $scope.selectAll = true;
        $scope.onSelectAll();
        $scope.item = {
          name: '学习能力',
          rate: 3.5
        };
        $scope.save();
        $httpBackend.expectPUT('/api/positions', putData).respond(200);
        var spy = sinon.spy($location, 'path');
        var notifySpy = sinon.spy(mvNotifier, 'notify');
        $scope.update();
        $httpBackend.flush();
        expect(spy).to.have.been.calledWith('/settings/positions');
        expect(notifySpy).to.have.been.calledWith('修改职位成功');
      }));

      it('should show error if create failed', inject(function (mvNotifier) {
        $scope.selectAll = true;
        $scope.onSelectAll();
        $scope.item = {
          name: '学习能力',
          rate: 3.5
        };
        $scope.save();
        $httpBackend.expectPUT('/api/positions', putData).respond(500, {message: 'error'});
        var notifySpy = sinon.spy(mvNotifier, 'error');
        $scope.update();
        $httpBackend.flush();
        expect(notifySpy).to.have.been.calledWith('修改职位失败');
      }));

      describe('remove', function () {
        it('should remove the corresponding item', function () {
          $scope.remove({
            name: '英语',
            rate: 0.5
          });
          expect($scope.position.evaluationCriterions).to.have.length(0);
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
            rate: 3.5
          };
          $scope.save();
          expect($scope.adding).to.equal(false);
          expect($scope.item).to.be.empty;
          expect($scope.position.evaluationCriterions).to.have.length(2);
        });
      });

      describe('cancel', function () {
        it('should change adding to false', function () {
          $scope.adding = true;
          $scope.cancel();
          expect($scope.adding).to.false;
          expect($scope.position.evaluationCriterions).to.have.length(1);
        });
      });

      describe('onSelectAll', function () {
        it('should not check all the users when init', function () {
          expect($scope.selectAll).to.be.false;
        });

        it('should check all the users when select all is checked', function () {
          $scope.selectAll = true;
          $scope.onSelectAll();
          expect(_.all($scope.users, 'checked')).to.be.true;
        });

        it('should check all the users when select all is not checked', function () {
          $scope.selectAll = false;
          $scope.onSelectAll();
          expect(_.some($scope.users, 'checked')).to.be.false;
        });
      });

      describe('onSelectUser', function () {
        it('should set selectAll to true when one user is not checked', function () {
          $scope.selectAll = true;
          $scope.onSelectAll();
          $scope.users[$scope.users.length - 1].checked = false;
          $scope.onSelectUser();
          expect($scope.selectAll).to.be.false;
        });

        it('should set selectAll to true when all users are checked', function () {
          $scope.selectAll = false;
          _.forEach($scope.users, function (user) {
            user.checked = true;
            $scope.onSelectUser();
          });
          expect($scope.selectAll).to.be.true;
        });
      });

    });
  });
});