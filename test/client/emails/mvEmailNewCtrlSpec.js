describe('mvEmailNewCtrl', function () {
  beforeEach(module('compass'));

  var $httpBackend,
    mvEmailNewCtrl,
    $scope;

  beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();
    mvEmailNewCtrl = $controller('mvEmailNewCtrl', {
      $scope: $scope
    });
  }));

  it('should initialize a default email object', function () {
    expect($scope.email).to.exist;
    expect($scope.email.port).to.equal(110);
    expect($scope.email.keepMails).to.be.true;
  });

  describe('create new email', function () {
    var emailData;
    beforeEach(function () {
      emailData = {
        address: 'aa@aa.com',
        account: 'aa',
        password: 'aa',
        server: 'aa.com',
        port: 110,
        keepMails: true
      };
    });

    it('should redirect to /settings/emails when success', inject(function ($location, mvNotifier) {
      var notifySpy = sinon.spy(mvNotifier, 'notify');
      $httpBackend.expectPOST('/api/emails', emailData).respond(200);
      var spy = sinon.spy($location, 'path');
      _.merge($scope.email, emailData);

      $scope.create();
      $httpBackend.flush();

      expect(spy).to.have.been.calledWith('/settings/emails');
      expect(notifySpy).to.have.been.calledWith('添加简历邮箱成功');
    }));

    it('should show error when create failed', inject(function ($location, mvNotifier) {
      var notifySpy = sinon.spy(mvNotifier, 'error');
      $httpBackend.expectPOST('/api/emails', emailData).respond(500, {message: 'error'});
      _.merge($scope.email, emailData);

      $scope.create();
      $httpBackend.flush();

      expect(notifySpy).to.have.been.calledWith('添加简历邮箱失败');
    }));
  });

  describe('watch email.ssl', function () {
    it('should change the default port from 110 to 995', function () {
      $scope.email.ssl = true;
      $scope.$digest();
      expect($scope.email.port).to.equal(995);
      $scope.email.ssl = false;
      $scope.$digest();
      expect($scope.email.port).to.equal(110);
    });

    it('should not change the port if user changed port ', function () {
      $scope.email.port = 465;
      $scope.email.ssl = true;
      $scope.$digest();
      expect($scope.email.port).to.equal(465);
      $scope.email.ssl = false;
      $scope.$digest();
      expect($scope.email.port).to.equal(465);
    });
  });
});