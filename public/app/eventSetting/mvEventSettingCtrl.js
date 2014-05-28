angular.module('compass')
  .controller('mvEventSettingCtrl', function ($scope, mvNotifier, mvEventSetting) {
    $scope.eventSetting = mvEventSetting.get();

    $scope.save = function () {
      mvEventSetting.save($scope.eventSetting, function () {
        mvNotifier.notify('面试设置已保存');
      });
    };
  });