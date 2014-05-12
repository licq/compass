angular.module('compass')
  .controller('mvEventNewCtrl', function ($scope, $modalInstance, mvUser, mvEmailTemplate, mvEvent, mvNotifier, application) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    $scope.today = today;
    $scope.event = {
      sendEventAlert: false,
      application: application._id
    };
    $scope.application = application;
    $scope.users = mvUser.query({fields: 'name'});

    $scope.create = function () {
      mvEvent.save($scope.event, function () {
        $modalInstance.close();
        mvNotifier.notify('创建面试邀请成功!');
      });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss();
    };

    $scope.$watch('event.sendEventAlert', function () {

      if ($scope.event.sendEventAlert) {
        $scope.emailTemplates = $scope.emailTemplates || mvEmailTemplate.query({fields: 'name'});
      }
    });
  });