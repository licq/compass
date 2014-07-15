angular.module('compass')
  .controller('mvResumeViewCtrl', function ($scope, mvResume, $routeParams, $location, $window) {
    mvResume.get({_id: $routeParams.id}, function (resume) {
      $scope.resume = resume;
      $scope.interview = $scope.resume.interview;
      $scope.mailHtml = '/api/mails/' + $scope.resume.mail + '/html';
    });

    $scope.back = function () {
      $location.path('/resumes');
    };

    $scope.original = false;

    $scope.print = function () {
      $scope.original = true;
      setTimeout(function () {
        $window.frames['mail-frame'].focus();
        $window.frames['mail-frame'].print();
      }, 500);
    };

  });