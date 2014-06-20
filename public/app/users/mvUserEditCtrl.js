'use strict';

angular.module('compass')
  .controller('mvUserEditCtrl', function ($scope, $rootScope, mvUser, mvRole, $routeParams, mvPermission, mvIdentity, $location, mvNotifier) {
    mvRole.query(function (roles) {
      $scope.roles = roles;
      mvUser.get({_id: $routeParams.id}, function (user) {
        $scope.user = user;
      });
    });

    $scope.update = function () {
      _.forEach($scope.roles,function(role){
        if(role._id === $scope.user.role._id){
          $scope.user.role = role;
          return false;
        }
      });
      $scope.user.$update(function () {
        $rootScope.$broadcast('userChanged', $scope.user);
        mvNotifier.notify('修改用户成功');
        $location.path('/settings/users');
      }, function (err) {
        $scope.err = err.data;
        mvNotifier.error('修改用户失败');
      });
    };

    $scope.cancel = function () {
      $location.path('/settings/users');
    };

  });