'use strict';

angular.module('compass')
    .controller('mvSignupSuccessCtrl', function ($scope, $routeParams) {
        $scope.email = $routeParams.email;
        $scope.code = $routeParams.code;
    });