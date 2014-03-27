'use strict';

angular.module('compass')
    .controller('mvUserEditCtrl', function ($scope, mvUser, $routeParams, $location) {
        $scope.user = mvUser.get({_id: $routeParams.id});

        $scope.update = function () {
            $scope.user.$update(function () {
                $location.path('/users');
            }, function (err) {
                console.log(err);
                $scope.err = err.data;
            });
        };

        $scope.cancel = function () {
            $location.path('/users');
        };
    });