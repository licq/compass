'use strict';

angular.module('compass')
    .controller('mvLoginCtrl', function ($scope, mvAuth, $location, mvNotifier) {
        $scope.login = function () {
            mvAuth.login({email: $scope.email, password: $scope.password, remember_me: $scope.remember_me})
                .then(function () {
                    $location.path('/dashboard');
                    mvNotifier.notify('登陆成功');
                })
                .catch(function (err) {
                    $scope.errorMessage = err.data.message;
                    mvNotifier.error('登陆失败');
                });
        };
    });