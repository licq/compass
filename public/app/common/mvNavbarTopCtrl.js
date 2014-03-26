'use strict';

angular.module('compass')
    .controller('mvNavbarTopCtrl', function ($scope, mvIdentity, mvAuth, $location, $rootScope) {
        $scope.identity = mvIdentity;

        $scope.logout = function () {
            mvAuth.logout().then(function () {
                $location.path('/login');
            });
        };

        $scope.enlarge = function () {
            $rootScope.$broadcast('sidebar:enlarge_changed');
        };
    });