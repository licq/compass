'use strict';

angular.module('compass')
  .controller('mvEmailEditCtrl', function ($scope, mvEmail, $routeParams, $location, mvNotifier) {

    mvEmail.get({_id: $routeParams.id}, function (email) {
      if (!email.protocol)
        email.protocol = 'pop3';
      $scope.email = email;
    });

    $scope.update = function () {
      $scope.saving = true;
      $scope.email.$update(function () {
        $location.path('/settings/emails');
        mvNotifier.notify('简历邮箱修改成功');
      }, function (res) {
        $scope.saving = false;
        $scope.err = res.data;
        mvNotifier.error('简历邮箱修改失败');
      });
    };

    $scope.cancel = function () {
      $location.path('/settings/emails');
    };
  });