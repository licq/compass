'use strict';

angular.module('compass')
  .controller('mvEmailNewCtrl', function ($scope, $location, mvEmail, mvNotifier) {
    $scope.email = new mvEmail({
      keepMails: true,
      protocol: 'imap',
      port:143
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

    $scope.$watch('email.protocol', function () {
      if ($scope.email.protocol === 'pop3'){
        $scope.email.ssl = false;
        $scope.email.tls = false;
        $scope.email.port = 110;
      } else if ($scope.email.protocol === 'imap'){
        $scope.email.tls = false;
        $scope.email.ssl = false;
        $scope.email.port = 143;
      }
    });

    $scope.$watch('email.ssl', function () {
      if ($scope.email.ssl && $scope.email.port === 110) {
        $scope.email.port = 995;
      } else if (!$scope.email.ssl && $scope.email.port === 995) {
        $scope.email.port = 110;
      }
    });

    $scope.$watch('email.tls', function () {
      if ($scope.email.tls && $scope.email.port === 143) {
        $scope.email.port = 993;
      } else if (!$scope.email.tls && $scope.email.port === 993) {
        $scope.email.port = 143;
      }
    });
  });

