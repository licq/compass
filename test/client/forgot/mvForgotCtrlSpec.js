describe('mvForgotCtrl', function () {
  beforeEach(module('compass'));
  var $httpBackend, $scope;
  beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();
    $controller('mvForgotCtrl', {
      $scope: $scope
    });
  }));

  it('should post email successfully', function () {
    var data = {
      email: 'test@compass.com',
      captcha: 'aabbcc'
    };

    $httpBackend.expectPUT('/publicApi/captchas', {captcha: data.captcha}).respond(200);
    _.merge($scope, data);
    $httpBackend.flush();

    $httpBackend.expectPOST('/publicApi/forgot', data).respond(200);

    $scope.sendResetEmail();

    $httpBackend.flush();
    expect($scope.sent).to.be.true;
  });

  describe('captcha', function () {

    it('should show error when captcha not right', function () {
      var data = {
        email: 'test@compass.com',
        captcha: 'aabbcc'
      };
      $httpBackend.expectPUT('/publicApi/captchas', {captcha: data.captcha}).respond(200);
      _.merge($scope, data);
      $httpBackend.flush();

      $httpBackend.expectPOST('/publicApi/forgot', data)
        .respond(function () {
          return [400, {errors: {captcha: {message: '验证码不正确'}}}];
        });

      $scope.sendResetEmail();

      $httpBackend.flush();
      expect($scope.sent).to.be.false;
      expect($scope.captchaValid).to.be.false;
      expect($scope.err).to.deep.equal({errors: {captcha: {message: '验证码不正确'}}});
    });

    it('should initialize the captchaUrl', function () {
      expect($scope.captchaUrl).to.exist;
    });

    it('should set captchaValid', function () {
      expect($scope.captchaValid).to.not.exist;
    });

    describe('changeCaptchaUrl', function () {
      it('should change captchaUrl', function () {
        var current = $scope.captchaUrl;
        setTimeout(function () {
          $scope.changeCaptchaUrl();
          expect($scope.captchaUrl).to.not.equal(current);
          expect($scope.captchaValid).to.not.exist;
        }, 1);
      });
    });

    describe('verifyCaptcha', function () {
      describe('verifySuccess', function () {
        it('should put /publicApi/captchas and set captchaValid to true', function () {
          $httpBackend.expectPUT('/publicApi/captchas', {captcha: 'aabbcc'}).respond(200);
          $scope.captcha = 'aabbcc';
          $scope.$digest();
          $httpBackend.flush();
          expect($scope.captchaValid).to.be.true;
          $scope.captcha = 'aabbc';
          $scope.$digest();
          expect($scope.captchaValid).to.not.exist;
        });
      });
      describe('verify failed', function () {
        it('should put /publicApi/captchas and set captchaValid to false', function () {
          $httpBackend.expectPUT('/publicApi/captchas', {captcha: 'aabbcc'}).respond(400);
          $scope.captcha = 'aabbcc';
          $scope.$digest();
          $httpBackend.flush();
          expect($scope.captchaValid).to.be.false;
        });
      });
    });
  });
});