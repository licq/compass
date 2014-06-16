'use strict';

angular.module('compass')
  .controller('mvUserEditCtrl', function ($scope, mvUser, mvRole, $routeParams, mvPermission, mvIdentity, $location, mvNotifier) {

    mvRole.query(function (roles) {
      $scope.roles = roles;
      mvUser.get({_id: $routeParams.id}, function (user) {
        $scope.user = user;
        $scope.oldUser = angular.copy(user);
      });
    });

    $scope.update = function () {
      $scope.user.$update(function () {
        if ($scope.user._id === mvIdentity.currentUser._id && $scope.user.role._id !== $scope.oldUser.role._id) {
          mvRole.get({_id: $scope.user.role._id}, function (role) {
            mvIdentity.currentUser.permissions = role.permissions;
            mvPermission.setPermissions();
          });
        }
        $location.path('/settings/users');
        mvNotifier.notify('修改用户成功');
      }, function (err) {
        $scope.err = err.data;
        mvNotifier.error('修改用户失败');
      });
    };

    $scope.cancel = function () {
      $location.path('/settings/users');
    };

  });