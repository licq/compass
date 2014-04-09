'use strict';

angular.module('compass')
    .controller('mvEmailNewCtrl', function ($scope, $location, mvEmail) {
        $scope.crumbs = [
            {text: '简历邮箱', url: 'emails'},
            {text: '新增', url: 'new'}
        ];
        $scope.email = new mvEmail({
            port: 110
        });

        $scope.create = function () {
            $scope.saving = true;
            $scope.email.$save(function () {
                $location.path('/emails');
            }, function (err) {
                $scope.saving = false;
                $scope.err = err.data;
            });
        };

        $scope.cancel = function () {
            $location.path('/emails');
        };
    });

