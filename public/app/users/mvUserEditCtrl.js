'use strict';

angular.module('compass')
  .controller('mvUserEditCtrl', function ($scope, mvUser, mvRole, $routeParams, $location, mvNotifier) {

    mvRole.query(function (roles) {
      $scope.roles = roles;
      mvUser.get({_id: $routeParams.id}, function (user) {
        $scope.user = user;
      });
    });

    $scope.update = function () {
      $scope.user.$update(function () {
        $location.path('/settings/users');
        mvNotifier.notify('添加用户成功');
      }, function (err) {
        $scope.err = err.data;
        mvNotifier.error('添加用户失败');
      });
    };

    $scope.cancel = function () {
      $location.path('/settings/users');
    };

  });