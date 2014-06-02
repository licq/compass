angular.module('compass')
  .controller('mvEventNewCtrl', function ($scope, $rootScope, $modalInstance, mvUser, mvEvent, mvNotifier, mvEventSetting, event) {
    var today = new Date(), endOfToday = new Date(), oldStartTime, newStartTime;
    today.setHours(0, 0, 0, 0);
    endOfToday.setHours(23, 59, 59, 999);

    $scope.today = today;

    $scope.cancel = function () {
      $modalInstance.dismiss();
    };

    $scope.update = function () {
      mvEvent.update($scope.event, function () {
          newStartTime = new Date($scope.event.startTime);

          if (newStartTime >= today &&
            newStartTime <= endOfToday &&
            (oldStartTime < today || oldStartTime > endOfToday)) {
            $rootScope.$broadcast('create_eventOfToday');
          }

          if ((newStartTime < today ||
            newStartTime > endOfToday) &&
            oldStartTime >= today && oldStartTime <= endOfToday) {
            $rootScope.$broadcast('delete_eventOfToday');
          }

          $modalInstance.close($scope.event);
          mvNotifier.notify('修改面试邀请成功!');

        }
      );
    };

    $scope.create = function () {
      mvEvent.save($scope.event, function () {
        newStartTime = new Date($scope.event.startTime);

        if (newStartTime >= today && newStartTime <= endOfToday) {
          $rootScope.$broadcast('create_eventOfToday');
        }

        $modalInstance.close($scope.event);
        mvNotifier.notify('创建面试邀请成功!');
      });
    };

    $scope.delete = function () {
      mvEvent.delete({_id: $scope.event._id}, function () {
        newStartTime = new Date($scope.event.startTime);

        if (newStartTime >= today && newStartTime <= endOfToday) {
          $rootScope.$broadcast('delete_eventOfToday');
        }

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
        oldStartTime = new Date(event.startTime);
        if ($scope.isNew) {
          $scope.event.duration = $scope.eventSetting.duration;
        }
      });
    });
  }
);