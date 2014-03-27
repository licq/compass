'use strict';

angular.module('compass')
    .controller('mvUserNewCtrl', function ($scope, $location, mvUser) {
        $scope.user = new mvUser();

        $scope.create = function () {
            $scope.user.$save(function () {
                $location.path('/users');
            }, function (err) {
                $scope.err = err.data;
            });
        };
    });

