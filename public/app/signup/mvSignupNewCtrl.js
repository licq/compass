'use strict';

angular.module('compass')
    .controller('mvSignupNewCtrl', function ($scope, mvSignup, $location) {
        $scope.create = function () {
            mvSignup.save({companyName: $scope.companyName,
                    admin: {email: $scope.admin.email, name: $scope.admin.name, password: $scope.admin.password}},
                function (signup) {
                    $location.path('/signup/success/' + signup._id + '/' + $scope.admin.email);
                }, function (err) {
                    $scope.err = err.data;
                });
        };
    });