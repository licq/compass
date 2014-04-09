'use strict';

angular.module('compass')
    .controller('mvUserNewCtrl', function ($scope, $location, mvUser) {
        $scope.crumbs = [
            {
                text: '用户', url: 'users'
            },
            {
                text: '添加', url: 'new'
            }
        ];

        $scope.user = new mvUser();

        $scope.create = function () {
            $scope.user.$save(function () {
                $location.path('/users');
            }, function (err) {
                $scope.err = err.data;
            });
        };
    });

