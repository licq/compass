'use strict';

angular.module('compass')
    .controller('mvUserEditCtrl', function ($scope, mvUser, $routeParams, $location) {
        mvUser.get({_id: $routeParams.id}, function (user) {
            $scope.user = user;
            $scope.crumbs = [
                {text: '用户', url: 'users'},
                {text: '修改', url: 'edit/' + user._id},
            ];
        });

        $scope.update = function () {
            $scope.user.$update(function () {
                $location.path('/users');
            }, function (err) {
                console.log(err);
                $scope.err = err.data;
            });
        };

        $scope.cancel = function () {
            $location.path('/users');
        };
    });