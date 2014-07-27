'use strict';

angular.module('compass')
  .controller('mvEmailNewCtrl', function ($scope, $location, mvEmail, mvNotifier) {
    $scope.email = new mvEmail({
      port: 110,
      keepMails: true
    });

    $scope.create = function () {
      $scope.saving = true;
      $scope.email.$save(function () {
        $location.path('/settings/emails');
        mvNotifier.notify('添加简历邮箱成功');
      }, function (err) {
        $scope.saving = false;
        $scope.err = err.data;
        mvNotifier.error('添加简历邮箱失败');
      });
    };

    $scope.cancel = function () {
      $location.path('/settings/emails');
    };

    $scope.$watch('email.ssl', function () {
      if ($scope.email.ssl && $scope.email.port === 110) {
        $scope.email.port = 995;
      } else if (!$scope.email.ssl && $scope.email.port === 995) {
        $scope.email.port = 110;
      }
    });
  });

