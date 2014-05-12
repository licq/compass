'use strict';

angular.module('compass')
  .controller('mvUserEditCtrl', function ($scope, mvUser, $routeParams, $location, mvNotifier) {
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
        mvNotifier.notify('添加用户成功');
      }, function (err) {
        $scope.err = err.data;
        mvNotifier.error('添加用户失败');
      });
    };

    $scope.cancel = function () {
      $location.path('/users');
    };
  });