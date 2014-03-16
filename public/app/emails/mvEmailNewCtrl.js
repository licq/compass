'use strict';

angular.module('compass')
    .controller('mvEmailNewController', function ($scope, $location, Email) {
        $scope.email = new Email({
            port: 110
        });

        $scope.create = function () {
            $scope.email.$save(function () {
                $location.path('/emails');
            });
        };
    });

