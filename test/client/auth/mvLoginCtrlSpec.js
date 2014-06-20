describe('mvLoginCtrl', function () {
  beforeEach(module('compass'));

  var mvLoginCtrl,
    $scope,
    $httpBackend;

  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();
    mvLoginCtrl = $controller('mvLoginCtrl', {
      $scope: $scope
    });
  }));

  it('should redirect to /today when login success', inject(function ($location, mvNotifier) {
    var notifySpy = sinon.spy(mvNotifier, 'notify');
    var userData = {email: 'email', password: 'password', remember_me: true};
    $httpBackend.expectPOST('/publicApi/sessions', userData)
      .respond({email: 'email'});
    var spy = sinon.spy($location, 'path');

    _.merge($scope, userData);

    $scope.login();
    $httpBackend.flush();
    expect(spy).to.have.been.calledWith('/today');
    expect(spy).to.have.been.calledOnce;
    expect(notifySpy).to.have.been.calledWith('登陆成功');
  }));

  it('should show error when login failed', inject(function (mvNotifier) {
    var notifySpy = sinon.spy(mvNotifier, 'error');
    var userData = {email: 'email', password: 'password', remember_me: true};
    $httpBackend.expectPOST('/publicApi/sessions', userData)
      .respond(401, {message: 'error'});

    _.merge($scope, userData);

    $scope.login();
    $httpBackend.flush();
    expect($scope.errorMessage).to.equal('error');
    expect(notifySpy).to.have.been.calledWith('登陆失败');
  }));
});