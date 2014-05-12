angular.module('compass')
  .controller('mvMailViewCtrl', function ($scope, mvMail, $routeParams, $location) {
    $scope.mail = mvMail.get({_id: $routeParams.id}, function (mail) {
      $scope.mail = mail;
      $scope.htmlUrl = '/api/mails/' + mail._id + '/html';

      $scope.crumbs = [
        {
          text: '邮件列表',
          url: 'mails'
        },
        {
          text: '邮件',
          url: mail._id
        }
      ];
    });

    $scope.close = function () {
      $location.path('/mails');
    };

    $scope.parse = function () {
      mvMail.parse({_id: $scope.mail._id});
    };
  });