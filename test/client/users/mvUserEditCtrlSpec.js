describe('mvUserEditCtrl', function () {
  beforeEach(module('compass'));

  var $httpBackend,
    mvUserEditCtrl,
    $scope;

  var userData = {
    email: 'aa@aa.com',
    name: 'aa',
    password: 'aa',
    title: 'ceo',
    _id: '7788',
    role: {_id: '7799', name: 'IAmARoleForTestingPurpose'},
    positions: ['1122']
  };

  beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();
    $httpBackend.expectGET('/api/roles').respond([
      {'_id': '4466', 'name': 'admin', 'permissions': ['*']},
      {'_id': '7799', 'name': 'IAmARoleForTestingPurpose', 'permissions': ['viewUser', 'viewResume']}
    ]);
    $httpBackend.expectGET('/api/positions?fields=name').respond([
      {'_id': '1122', 'name': 'cio'},
      {'_id': '3344', 'name': 'sales'}
    ]);
    $httpBackend.expectGET('/api/users/7788').respond(userData);
    $httpBackend.expectGET('/api/applicationSettings?fields=positionRightControlled').respond({positionRightControlled: false});
    mvUserEditCtrl = $controller('mvUserEditCtrl', {
      $scope: $scope,
      $routeParams: {id: '7788'},
      mvIdentity: {currentUser: {_id: '7788'}}
    });
    $httpBackend.flush();
  }));

  it('should init correctly', function () {
    expect($scope.positions).to.have.length(2);
    expect($scope.positionRightControlled).to.be.false;
    expect($scope.roles).to.have.length(2);
    expect($scope.user).to.exist;
  });

  describe('update user', function () {
    it('should redirect to /users if update successfully', inject(function ($location, mvNotifier) {
      $scope.selectAll = true;
      $scope.onSelectAll();
      userData.positions = ['1122', '3344'];
      $scope.user.role._id = '4466';
      userData.role = {'_id': '4466', 'name': 'admin', 'permissions': ['*']};
      var notifySpy = sinon.spy(mvNotifier, 'notify');
      $httpBackend.expectPUT('/api/users/7788', userData).respond(200);
      var spy = sinon.spy($location, 'path');
      $scope.update();
      $httpBackend.flush();
      expect(spy).to.have.been.calledWith('/settings/users');
      expect(notifySpy).to.have.been.calledWith('修改用户成功');
    }));

    it('should show error if update failed', inject(function ($location, mvNotifier) {
      $scope.selectAll = true;
      $scope.onSelectAll();
      userData.positions = ['1122', '3344'];
      $scope.user.role._id = '4466';
      userData.role = {'_id': '4466', 'name': 'admin', 'permissions': ['*']};
      var notifySpy = sinon.spy(mvNotifier, 'error');
      $httpBackend.expectPUT('/api/users/7788', userData).respond(500, {message: 'error'});
      $scope.update();
      $httpBackend.flush();
      expect(notifySpy).to.have.been.calledWith('修改用户失败');
    }));

    describe('onSelectAll', function () {
      it('should not check the positions the user owns when init', function () {
        expect($scope.positions[0].checked).to.be.true;
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

    describe('onSelectPosition', function () {
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