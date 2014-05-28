describe('mvEmailEditCtrl', function () {
  beforeEach(module('compass'));

  var $httpBackend,
    mvEmailEditCtrl,
    $scope;

  var emailData = {
    address: 'aa@aa.com',
    account: 'aa',
    password: 'aa',
    server: 'aa.com',
    port: 110,
    _id: 7788
  };

  beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();
    mvEmailEditCtrl = $controller('mvEmailEditCtrl', {
      $scope: $scope,
      $routeParams: {id: '7788'}
    });
  }));

  it('should get email object', function () {
    $httpBackend.expectGET('/api/emails/7788').respond(emailData);
    $httpBackend.flush();

    expect($scope.email).to.exist;
  });

  describe('update email', function () {
    beforeEach(function () {
      $httpBackend.expectGET('/api/emails/7788').respond(emailData);
      $httpBackend.flush();
    });

    it('should update email and redirect to /emails', inject(function ($location, mvNotifier) {
      var notifySpy = sinon.spy(mvNotifier, 'notify');
      $httpBackend.expectPUT('/api/emails/7788', emailData).respond(200);
      var spy = sinon.spy($location, 'path');

      $scope.update();
      $httpBackend.flush();

      expect(spy).to.have.been.calledWith('/settings/emails');
      expect(notifySpy).to.have.been.calledWith('简历邮箱修改成功');
    }));
    it('should show error if failed', inject(function (mvNotifier) {
      var notifySpy = sinon.spy(mvNotifier, 'error');
      $httpBackend.expectPUT('/api/emails/7788', emailData).respond(500, {message: 'error'});

      $scope.update();
      $httpBackend.flush();

      expect($scope.err).to.exist;
      expect(notifySpy).to.have.been.calledWith('简历邮箱修改失败');
    }));
  });
});