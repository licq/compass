angular.module('compass')
  .controller('mvEventNewCtrl', function ($scope, $modalInstance, mvUser, mvEvent, mvNotifier, mvEventSetting, event) {
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

    $scope.delete = function () {
      mvEvent.delete({_id: $scope.event._id}, function () {
        $modalInstance.close();
        mvNotifier.notify('已删除面试邀请!');
      });
    };

    mvEventSetting.get(function (res) {
      $scope.eventSetting = res;
      mvUser.query({fields: 'name'}, function (res) {
        $scope.users = res;
        $scope.isNew = !event._id;
        $scope.event = event;
        if ($scope.isNew) {
          $scope.event.duration = $scope.eventSetting.duration;
        }
      });
    });
  });