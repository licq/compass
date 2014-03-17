'use strict';

angular.module('compass')
    .controller('mvEmailNewCtrl', function ($scope, $location, mvEmail) {
        $scope.email = new mvEmail({
            port: 110
        });

        $scope.create = function () {
            $scope.email.$save(function () {
                $location.path('/emails');
            }, function (err) {
                $scope.err = err.data;
            });
        };
    });

