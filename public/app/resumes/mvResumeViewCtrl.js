angular.module('compass')
  .controller('mvResumeViewCtrl', function ($scope, mvResume, $routeParams, $location) {
    mvResume.get({_id: $routeParams.id}, function (resume) {
      $scope.resume = resume;
      $scope.interview = $scope.resume.interview;
    });

    $scope.selectMail = function () {
      $scope.mailHtml = $scope.mailHtml || '/api/mails/' + $scope.resume.mail + '/html';
    };

    $scope.back = function () {
      $location.path('/resumes');
    };
  });