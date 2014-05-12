'use strict';

angular.module('compass')
  .controller('mvSignupActivateCtrl', function ($scope, mvSignup, $routeParams) {
    mvSignup.activate({code: $routeParams.code},
      function () {
        $scope.success = true;
      },
      function (err) {
        $scope.err = err.data;
      }
    );
  });