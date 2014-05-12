'use strict';

angular.module('compass')
  .controller('mvEmailEditCtrl', function ($scope, mvEmail, $routeParams, $location, mvNotifier) {

    $scope.email = mvEmail.get({_id: $routeParams.id}, function (email) {
      $scope.email = email;
      $scope.crumbs = [
        {text: '简历邮箱', url: 'emails'},
        {text: '修改', url: 'edit/' + email._id}
      ];
    });

    $scope.update = function () {
      $scope.saving = true;
      $scope.email.$update(function () {
        $location.path('/emails');
        mvNotifier.notify('简历邮箱修改成功');
      }, function (res) {
        $scope.saving = false;
        $scope.err = res.data;
        mvNotifier.error('简历邮箱修改失败');
      });
    };

    $scope.cancel = function () {
      $location.path('/emails');
    };
  });