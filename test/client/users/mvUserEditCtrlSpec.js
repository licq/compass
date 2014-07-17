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
    port: 110,
    _id: 7788,
    role: '8833'
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
    mvUserEditCtrl = $controller('mvUserEditCtrl', {
      $scope: $scope,
      $routeParams: {id: '7788'},
      mvIdentity: {currentUser:{_id: '7788'}}
    });
    $httpBackend.flush();
  }));

  it('should get user  and roles', function () {
    expect($scope.roles).to.have.length(2);
    expect($scope.user).to.exist;
  });

  describe('update user', function () {
    it('should redirect to /users if update successfully', inject(function ($location, mvNotifier) {
      var notifySpy = sinon.spy(mvNotifier, 'notify');
      $httpBackend.expectPUT('/api/users/7788', userData).respond(200);
      var spy = sinon.spy($location, 'path');
      $scope.update();
      $httpBackend.flush();
      expect(spy).to.have.been.calledWith('/settings/users');
      expect(notifySpy).to.have.been.calledWith('修改用户成功');
    }));

    it('should show error if update failed', inject(function ($location, mvNotifier) {
      var notifySpy = sinon.spy(mvNotifier, 'error');
      $httpBackend.expectPUT('/api/users/7788', userData).respond(500, {message: 'error'});
      $scope.update();
      $httpBackend.flush();

      expect(notifySpy).to.have.been.calledWith('修改用户失败');
      expect($scope.err).to.exist;
    }));
  });
});