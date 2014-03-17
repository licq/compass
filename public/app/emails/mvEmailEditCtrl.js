'use strict';

angular.module('compass')
    .controller('mvEmailEditCtrl', function ($scope, mvEmail, $routeParams, $location) {
        $scope.email = mvEmail.get({_id: $routeParams.id});

        $scope.update = function () {
            $scope.email.$update(function () {
                $location.path('/emails');
            }, function (err) {
                console.log(err);
                $scope.err = err.data;
            });
        };

        $scope.cancel = function () {
            $location.path('/emails');
        };
    });