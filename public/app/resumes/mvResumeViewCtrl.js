angular.module('compass')
  .controller('mvResumeViewCtrl', function ($scope, mvResume, $routeParams, $location) {
    $scope.resume = mvResume.get({_id: $routeParams.id});

    $scope.selectMail = function () {
      $scope.mailHtml = $scope.mailHtml || '/api/mails/' + $scope.resume.mail + '/html';
    };

    $scope.back = function () {
      $location.path('/resumes');
    };
  });