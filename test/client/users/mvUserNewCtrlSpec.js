describe('mvUserNewCtrl', function () {
  var $httpBackend,
    $scope,
    mvUserNewCtrl;

  beforeEach(module('compass'));
  describe('#create', function () {

    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
      $httpBackend = _$httpBackend_;
      $scope = $rootScope.$new();
      $httpBackend.expectGET('/api/roles').respond([
        {'_id': '4466', 'name': 'admin', 'permissions': ['*']}
      ]);

      $httpBackend.expectGET('/api/positions?fields=name').respond([
        {'_id': '1122', 'name': 'cio'},
        {'_id': '3344', 'name': 'sales'}
      ]);
      $httpBackend.expectGET('/api/applicationSettings?fields=positionRightControlled').respond({positionRightControlled: false});
      mvUserNewCtrl = $controller('mvUserNewCtrl', {
        $scope: $scope
      });
      $httpBackend.flush();
    }));

    describe('create user', function () {
      var userData;
      beforeEach(function () {
        userData = {
          name: 'test user',
          email: 'test@test.com',
          password: 'password',
          title: 'ceo',
          role: '4466'
        };
      });

      it('should init correctly', function () {
        expect($scope.positions).to.have.length(2);
        expect($scope.positionRightControlled).to.be.false;
        expect($scope.roles).to.have.length(1);
      });

      it('should go to success page when create success', inject(function ($location, mvNotifier) {
        $scope.selectAll = true;
        $scope.onSelectAll();
        _.merge($scope.user, userData);
        userData.positions = ['1122', '3344'];
        $httpBackend.expectPOST('/api/users', userData).respond(200);
        var spy = sinon.spy($location, 'path');
        var notifySpy = sinon.spy(mvNotifier, 'notify');
        $scope.create();
        $httpBackend.flush();
        expect(spy).to.have.been.calledWith('/settings/users');
        expect(notifySpy).to.have.been.calledWith('添加用户成功');
      }));

      it('should show error if create failed', inject(function (mvNotifier) {
        $scope.selectAll = true;
        $scope.onSelectAll();
        _.merge($scope.user, userData);
        userData.positions = ['1122', '3344'];
        $httpBackend.expectPOST('/api/users', userData).respond(500, {message: 'error'});
        var notifySpy = sinon.spy(mvNotifier, 'error');
        _.merge($scope.user, userData);
        $scope.create();
        $httpBackend.flush();
        expect(notifySpy).to.have.been.calledWith('添加用户失败');
      }));

      describe('onSelectAll', function () {
        it('should not check all the positions when init', function () {
          expect($scope.selectAll).to.be.false;
        });

        it('should check all the positions when select all is checked', function () {
          $scope.selectAll = true;
          $scope.onSelectAll();
          expect(_.all($scope.positions, 'checked')).to.be.true;
        });

        it('should check all the positions when select all is not checked', function () {
          $scope.selectAll = false;
          $scope.onSelectAll();
          expect(_.some($scope.positions, 'checked')).to.be.false;
        });
      });

      describe('onChecked', function () {
        it('should set selectAll to true when one position is not checked', function () {
          $scope.selectAll = true;
          $scope.onSelectAll();
          $scope.positions[$scope.positions.length - 1].checked = false;
          $scope.onSelectPosition();
          expect($scope.selectAll).to.be.false;
        });

        it('should set selectAll to true when all positions are checked', function () {
          $scope.selectAll = false;
          _.forEach($scope.positions, function (position) {
            position.checked = true;
            $scope.onSelectPosition();
          });
          expect($scope.selectAll).to.be.true;
        });
      });
    });
  });
});