describe('mvSignupNewCtrl', function () {
  var $httpBackend,
    $scope,
    mvSignupNewCtrl;

  describe('#create', function () {
    beforeEach(module('compass'));
    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
      $httpBackend = _$httpBackend_;
      $scope = $rootScope.$new();

      mvSignupNewCtrl = $controller('mvSignupNewCtrl', {
        $scope: $scope
      });
    }));

    it('should go to success page when create success', inject(function ($location) {
      var signupData = {
        companyName: 'company',
        adminEmail: 'aa@aa.com',
        adminName: 'aa',
        adminPassword: 'password',
        captcha: 'aabbcc'
      };
      $httpBackend.expectPUT('/publicApi/captchas', {captcha: signupData.captcha}).respond(200);
      _.merge($scope, signupData);
      $httpBackend.flush();

      $httpBackend.expectPOST('/publicApi/signups', signupData)
        .respond({_id: '7788'});
      var spy = sinon.spy($location, 'path');
      var searchSpy = sinon.spy($location, 'search');

      $scope.create();

      $httpBackend.flush();
      expect(spy).to.have.been.calledWith('/signup/success');
      expect(searchSpy).to.have.been.calledWith({email: 'aa@aa.com'});
    }));

    it('should show error when captcha not right', function () {
      var signupData = {
        companyName: 'company',
        adminEmail: 'aa@aa.com',
        adminName: 'aa',
        adminPassword: 'password',
        captcha: 'aabbcc'
      };
      $httpBackend.expectPUT('/publicApi/captchas', {captcha: signupData.captcha}).respond(200);
      _.merge($scope, signupData);
      $httpBackend.flush();

      $httpBackend.expectPOST('/publicApi/signups', signupData)
        .respond(function () {
          return [400, {errors: {captcha: {message: '验证码不正确'}}}];
        });

      $scope.create();

      $httpBackend.flush();
      expect($scope.captchaValid).to.be.false;
      expect($scope.err).to.deep.equal({errors: {captcha: {message: '验证码不正确'}}});
    });

    it('should initialize the captchaUrl', function () {
      expect($scope.captchaUrl).to.exist;
    });

    it('should set captchaValid', function () {
      expect($scope.captchaValid).to.not.exist;
    });

    describe('watch adminEmail', function () {
      it('should delete adminEmail error when change adminEmail', function () {
        $scope.adminEmail = 'hello@hello.com';
        $scope.err = {
          errors: {
            adminEmail: {
              message: '该邮箱已注册'
            }
          }
        };
        $scope.adminEmail = 'hello@hello.co';
        $scope.$digest();
        expect($scope.err.errors.adminEmail).to.not.exist;
      });
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