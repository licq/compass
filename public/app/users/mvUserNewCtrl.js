'use strict';

angular.module('compass')
  .controller('mvUserNewCtrl', function ($scope, $location, mvUser, mvNotifier) {
    $scope.user = new mvUser();

    $scope.create = function () {
      $scope.user.$save(function () {
        $location.path('/users');
        mvNotifier.notify('添加用户成功');
      }, function (err) {
        $scope.err = err.data;
        mvNotifier.error('添加用户失败');
      });
    };

    $scope.close = function () {
      $location.path('/users');
    };
  });

