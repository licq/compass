angular.module('compass')
  .controller('mvEventNewCtrl', function ($scope, $modalInstance, mvUser, mvEmailTemplate, mvEvent, mvNotifier, event) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    $scope.today = today;

    $scope.cancel = function () {
      $modalInstance.dismiss();
    };

    $scope.update = function () {
      mvEvent.update($scope.event, function () {
        $modalInstance.close($scope.event);
        mvNotifier.notify('修改面试邀请成功!');
      });
    };

    $scope.create = function () {
      mvEvent.save($scope.event, function () {
        $modalInstance.close($scope.event);
        mvNotifier.notify('创建面试邀请成功!');
      });
    };

    mvUser.query({fields: 'name'}, function (res) {
      $scope.users = res;
      mvEmailTemplate.query({fields: 'name'}, function (res) {
        $scope.emailTemplates = res;
        $scope.isNew = !event._id;
        $scope.event = event;
      });
    });
  });