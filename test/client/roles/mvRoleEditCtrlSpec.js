describe('mvRoleEditCtrl', function () {
  beforeEach(module('compass'));

  var $httpBackend,
    mvRoleEditCtrl,
    $scope;

  beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();
    $httpBackend.expectGET('/api/roles/7788').respond({
      name: 'testRole',
      _id: '7788',
      permissions: ['events', 'appNew']
    });


    mvRoleEditCtrl = $controller('mvRoleEditCtrl', {
      $scope: $scope,
      $routeParams: {id: '7788'},
      menuPermissions: [
        {name: 'today', cnName: '今日', enabled: false},
        {name: 'events', cnName: '日历', enabled: false},
        {name: 'applications', cnName: '应聘', enabled: false,
          submenus: [
            {name: 'appNew', cnName: '新应聘', enabled: false},
            {name: 'appUndetermined', cnName: '待定', enabled: false},
            {name: 'appPursued', cnName: '通过', enabled: false}
          ]}
      ],
      mvIdentity: {currentUser: {role:'3388'}}
    });

    $httpBackend.flush();
  }));

  it('should get role  and roles', function () {
    expect($scope.role.name).to.be.equal('testRole');
    expect($scope.menuPermissions).to.deep.equal(
      [
        {name: 'today', cnName: '今日', enabled: false},
        {name: 'events', cnName: '日历', enabled: true},
        {name: 'applications', cnName: '应聘', enabled: false,
          submenus: [
            {name: 'appNew', cnName: '新应聘', enabled: true},
            {name: 'appUndetermined', cnName: '待定', enabled: false},
            {name: 'appPursued', cnName: '通过', enabled: false}
          ]}
      ]);
  });

  describe('update role', function () {
    var notifySpy, locationSpy;
    beforeEach(inject(function ($location, mvNotifier) {
      notifySpy = sinon.spy(mvNotifier, 'notify');
      locationSpy = sinon.spy($location, 'path');
      $scope.menuPermissions = [
        {name: 'today', cnName: '今日', enabled: true},
        {name: 'events', cnName: '日历', enabled: false},
        {name: 'applications', cnName: '应聘', enabled: false,
          submenus: [
            {name: 'appNew', cnName: '新应聘', enabled: true},
            {name: 'appUndetermined', cnName: '待定', enabled: false},
            {name: 'appPursued', cnName: '通过', enabled: true}
          ]}
      ];
    }));
    it('should redirect to /roles if update successfully', inject(function () {
      $httpBackend.expectPUT('/api/roles/7788', {
        name: 'testRole',
        _id: '7788',
        permissions: ['today', 'appNew', 'appPursued']
      }).respond(200);
      $scope.update();
      $httpBackend.flush();
      expect(locationSpy).to.have.been.calledWith('/settings/roles');
      expect(notifySpy).to.have.been.calledWith('修改角色成功');
    }));

    it('should show error if update failed', inject(function ($location, mvNotifier) {
      var notifySpy = sinon.spy(mvNotifier, 'error');
      $httpBackend.expectPUT('/api/roles/7788', {
        name: 'testRole',
        _id: '7788',
        permissions: ['today', 'appNew', 'appPursued']
      }).respond(500, {message: 'error'});
      $scope.update();
      $httpBackend.flush();

      expect(notifySpy).to.have.been.calledWith('修改角色失败');
      expect($scope.err).to.exist;
    }));
  });
});