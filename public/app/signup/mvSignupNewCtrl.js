'use strict';

angular.module('compass')
  .controller('mvSignupNewCtrl', function ($scope, mvSignup, $location, $http) {
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

    $scope.create = function () {
      mvSignup.save({
        companyName: $scope.companyName,
        adminEmail: $scope.adminEmail,
        adminName: $scope.adminName,
        adminPassword: $scope.adminPassword,
        captcha: $scope.captcha
      }, function () {
        $location.path('/signup/success').search({email: $scope.adminEmail});
      }, function (err) {
        $scope.err = err.data;
        if ($scope.err.errors.captcha) {
          $scope.captchaValid = false;
        }
      });
    };
  });