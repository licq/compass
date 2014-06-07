angular.module('compass')
  .controller('mvEventNewCtrl', function ($scope, $rootScope, $modalInstance, $location, mvUser, mvEvent, mvNotifier, mvEventSetting, mvIdentity, event) {
    var today = new Date(), oldStartTime, newStartTime;
    today.setHours(0, 0, 0, 0);
    $scope.today = today;

    $scope.cancel = function () {
      $modalInstance.dismiss();
    };

    $scope.update = function () {
      mvEvent.update($scope.event, function () {
          newStartTime = new Date($scope.event.startTime);
          $rootScope.$broadcast('changeOfEvent', 'update', newStartTime, oldStartTime);
          $modalInstance.close($scope.event);
          mvNotifier.notify('修改面试邀请成功!');
        }
      );
    };

    $scope.create = function () {
      mvEvent.save($scope.event, function () {
        newStartTime = new Date($scope.event.startTime);
        $rootScope.$broadcast('changeOfEvent', 'create', newStartTime);
        $modalInstance.close($scope.event);
        mvNotifier.notify('创建面试邀请成功!');
      });
    };

    $scope.delete = function () {
      mvEvent.delete({_id: $scope.event._id}, function () {
        $rootScope.$broadcast('changeOfEvent', 'delete', null, oldStartTime, $scope.event.countOfEvents);
        $modalInstance.close();
        mvNotifier.notify('已删除面试邀请!');
      });
    };

    $scope.viewResume = function (application) {
      $location.path('/resumes/' + application);
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
          $scope.event.interviewers = [mvIdentity.currentUser._id];
        }
      });
    });
  }
);