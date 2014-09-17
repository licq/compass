angular.module('compass')
  .controller('mvResumeViewCtrl', function ($scope, mvResume, mvNotifier, $routeParams, $location, $window) {
    mvResume.get({_id: $routeParams.id}, function (resume) {
      $scope.resume = resume;
      $scope.interview = $scope.resume.interview;
      $scope.mailHtml = '/api/mails/' + $scope.resume.mail + '/html';

      if ($scope.resume.status === 'archived' || $scope.resume.status === 'duplicate')
        $scope.newStatus = '通过';
      else
        $scope.newStatus = '面试';
    });

    $scope.back = function () {
      $location.path('/resumes');
    };

    $scope.resetStatus = function () {
      mvResume.resetStatus({_id: $scope.resume._id}, function () {
          mvNotifier.notify('已将简历恢复到' + $scope.newStatus + '列表中');
          $location.path('/resumes');
        }
      );
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