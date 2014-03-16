angular.module('compass')
    .controller('mvLoginCtrl', function ($scope, mvAuth, mvIdentity, $location) {
        $scope.login = function () {
            mvAuth.login({email: $scope.email, password: $scope.password, remember_me: $scope.remember_me})
                .then(function () {
                    $location.path('/dashboard');
                })
                .catch(function (err) {
                    $scope.errorMessage = err.message;
                });
        };
    });