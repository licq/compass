describe('mvUserNewCtrl', function () {
  var $httpBackend,
    $scope,
    mvUserNewCtrl;

  beforeEach(module('compass'));
  describe('#create', function () {

    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
      $httpBackend = _$httpBackend_;
      $scope = $rootScope.$new();
      mvUserNewCtrl = $controller('mvUserNewCtrl', {
        $scope: $scope
      });
    }));

    describe('create user', function () {
      var userData;
      beforeEach(function () {
        userData = {
          name: 'test user',
          email: 'test@test.com',
          password: 'password',
          title: 'ceo'
        };
      });
      it('should go to success page when create success', inject(function ($location, mvNotifier) {
        $httpBackend.expectPOST('/api/users', userData).respond(200);
        var spy = sinon.spy($location, 'path');
        var notifySpy = sinon.spy(mvNotifier, 'notify');
        _.merge($scope.user, userData);

        $scope.create();

        $httpBackend.flush();
        expect(spy).to.have.been.calledWith('/users');
        expect(notifySpy).to.have.been.calledWith('添加用户成功');
      }));

      it('should show error if create failed', inject(function (mvNotifier) {
        $httpBackend.expectPOST('/api/users', userData).respond(500, {message: 'error'});
        var notifySpy = sinon.spy(mvNotifier, 'error');
        _.merge($scope.user, userData);
        $scope.create();
        $httpBackend.flush();
        expect(notifySpy).to.have.been.calledWith('添加用户失败');
      }));
    });
  });
});