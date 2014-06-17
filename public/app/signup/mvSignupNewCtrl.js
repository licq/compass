'use strict';

angular.module('compass')
  .controller('mvSignupNewCtrl', function ($scope, mvSignup, $location) {
    $scope.create = function () {
      mvSignup.save({
        companyName: $scope.companyName,
        adminEmail: $scope.adminEmail,
        adminName: $scope.adminName,
        adminPassword: $scope.adminPassword
      }, function () {
        $location.path('/signup/success').search({email: $scope.adminEmail});
      }, function (err) {
        $scope.err = err.data;
      });
    };
  });