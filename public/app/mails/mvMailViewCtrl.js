angular.module('compass')
  .controller('mvMailViewCtrl', function ($scope, mvMail, mvNotifier, $routeParams, $location) {
    $scope.mail = mvMail.get({_id: $routeParams.id}, function (mail) {
      $scope.mail = mail;
      $scope.htmlUrl = '/api/mails/' + mail._id + '/html';
    });

    $scope.close = function () {
      $location.path('/settings/mails');
    };

    $scope.parse = function () {
      mvMail.parse({_id: $scope.mail._id},
        function () {
          mvNotifier.notify('邮件解析成功');
        },
        function () {
          mvNotifier.notify('邮件解析失败');
        });
    };
  });