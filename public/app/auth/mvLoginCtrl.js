angular.module('compass').controller('mvLoginCtrl', function ($scope, mvSession, mvIdentity, $location) {
    $scope.login = function () {
        mvSession.save({email: $scope.email, password: $scope.password}, function (user) {
                mvIdentity.currentUser = user;
                $location.path('/dashboard');
            },
            function (error) {
                $scope.errorMessage = error.data.message;
            }
        );
    };
});