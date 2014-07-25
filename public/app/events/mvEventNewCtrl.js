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
          $modalInstance.close(withInterviewerName($scope.event));
          mvNotifier.notify('修改面试邀请成功!');
        }
      );
    };

    $scope.create = function () {
      mvEvent.save($scope.event, function () {
        newStartTime = new Date($scope.event.startTime);
        $rootScope.$broadcast('changeOfEvent', 'create', newStartTime);
        $modalInstance.close(withInterviewerName($scope.event));
        mvNotifier.notify('创建面试邀请成功!');
      });
    };

    function withInterviewerName(event) {
      event.interviewers = _.map(event.interviewers, function (id) {
        return {
          _id: id,
          name: _.find($scope.interviewers, {_id: id}).name
        };
      });
      return event;
    }

    $scope.remove = function () {
      mvEvent.remove({_id: $scope.event._id}, function () {
        $rootScope.$broadcast('changeOfEvent', 'delete', null, oldStartTime);
        $modalInstance.close();
        mvNotifier.notify('已删除面试邀请!');
      });
    };

    $scope.viewResume = function (application) {
      $location.path('/resumes/' + application);
      $modalInstance.close();
    };

    mvEventSetting.get(function (res) {
      $scope.eventSetting = res;
      $scope.isNew = !event._id;
      mvEvent.availableInterviewers({id: event._id, application: event.application}, function (res) {
        $scope.interviewers = res;
        $scope.event = event;
        oldStartTime = new Date(event.startTime);
        if ($scope.isNew) {
          $scope.event.duration = $scope.eventSetting.duration;
          $scope.event.startTime = moment().hour(14).minute(0).second(0).millisecond(0).add('days', 1);
          if (_.findIndex($scope.interviewers, function (interviewer) {
            return mvIdentity.currentUser._id === interviewer._id;
          }) > -1) {
            $scope.event.interviewers = [mvIdentity.currentUser._id];
          }
        }
      });
    });
  }
);