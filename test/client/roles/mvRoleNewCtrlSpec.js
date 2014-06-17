describe('mvRoleNewCtrl', function () {
  var $httpBackend,
    $scope,
    mvRoleNewCtrl;

  beforeEach(module('compass'));
  describe('#create', function () {
    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
      $httpBackend = _$httpBackend_;
      $scope = $rootScope.$new();
      mvRoleNewCtrl = $controller('mvRoleNewCtrl', {
        $scope: $scope,
        menuPermissions : [
          {name: 'events', cnName: '日历', enabled: true},
          {name: 'applications', cnName: '应聘', enabled: false,
            submenus: [
              {name: 'appNew', cnName: '新应聘', enabled: true},
              {name: 'appUndetermined', cnName: '待定', enabled: false},
              {name: 'appPursued', cnName: '通过', enabled: false}
            ]}
        ]
      });
      $scope.role.name = 'testRole';
    }));

    describe('create role', function () {
      it('should go to success page when create success', inject(function ($location, mvNotifier) {
        $httpBackend.expectPOST('/api/roles', {name: 'testRole', permissions: ['events', 'appNew']}).respond(200);
        var spy = sinon.spy($location, 'path');
        var notifySpy = sinon.spy(mvNotifier, 'notify');

        $scope.create();

        $httpBackend.flush();
        expect(spy).to.have.been.calledWith('/settings/roles');
        expect(notifySpy).to.have.been.calledWith('添加角色成功');
      }));

      it('should show error if create failed', inject(function (mvNotifier) {
        $httpBackend.expectPOST('/api/roles', {name: 'testRole', permissions: ['events', 'appNew']}).respond(500, {message: 'error'});
        var notifySpy = sinon.spy(mvNotifier, 'error');
        $scope.create();
        $httpBackend.flush();
        expect(notifySpy).to.have.been.calledWith('添加角色失败');
      }));
    });
  });
});