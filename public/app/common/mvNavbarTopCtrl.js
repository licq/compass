angular.module('compass')
    .controller('mvNavbarTopCtrl', function ($scope, mvIdentity, mvAuth, $location) {
        $scope.identity = mvIdentity;

        $scope.logout = function () {
            mvAuth.logout().then(function () {
                $location.path('/login');
            });
        };
    });