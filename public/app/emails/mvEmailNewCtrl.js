'use strict';

angular.module('compass')
    .controller('mvEmailNewCtrl', function ($scope, $location, mvEmail, mvNotifier) {
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
                mvNotifier.notify('添加简历邮箱成功');
            }, function (err) {
                $scope.saving = false;
                $scope.err = err.data;
                mvNotifier.error('添加简历邮箱失败');
            });
        };

        $scope.cancel = function () {
            $location.path('/emails');
        };
    });

