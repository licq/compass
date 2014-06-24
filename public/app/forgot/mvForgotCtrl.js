angular.module('compass')
  .controller('mvForgotCtrl', function (mvForgot, $scope, $location, $http) {

    $scope.sent = false;

    $scope.changeCaptchaUrl = function () {
      $scope.captchaUrl = '/publicApi/captchas?' + new Date().getTime();
      $scope.captchaValid = undefined;
    };

    $scope.changeCaptchaUrl();
    $scope.captchaValid = undefined;
    $scope.captcha = '';

    $scope.$watch('captcha', function () {
      if ($scope.captcha.length === 6) {
        $http.put('/publicApi/captchas', {captcha: $scope.captcha}).success(function () {
          $scope.captchaValid = true;
        }).error(function (data) {
          $scope.captchaValid = false;
          $scope.err = data;
        });
      } else {
        $scope.captchaValid = undefined;
      }
    });

    $scope.sendResetEmail = function () {
      mvForgot.save({
        email: $scope.email,
        captcha: $scope.captcha
      }, function () {
        $scope.sent = true;
      },
        function (err) {
          $scope.err = err.data;
          if ($scope.err.errors.captcha) {
            $scope.captchaValid = false;
          }
        });
    };
  });