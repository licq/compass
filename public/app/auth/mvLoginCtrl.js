angular.module('compass').controller('mvLoginCtrl', function ($scope, $http, mvIdentity,$location) {
    $scope.login = function () {
        $http.post('/sessions', {email: $scope.email, password: $scope.password}).then(function (response) {
            console.log(response);
            if (response.data.success) {
                mvIdentity.currentUser = response.data.user;
                $location.path('#/dashbaord');
            } else {
                $scope.errorMessage = response.data.reason;
            }
        });
    };
});