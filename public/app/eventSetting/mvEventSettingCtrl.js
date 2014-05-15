angular.module('compass')
  .controller('mvEventSettingCtrl', function ($scope, mvNotifier, mvEventSetting) {
    $scope.crumbs = [
      {
        text: '设置',
        url: 'settings'
      },
      {
        text: '面试设置',
        url: 'eventSetting'
      }
    ];

    mvEventSetting.get(function (res) {
      $scope.eventSetting = res;
    }, function (res) {
      if (res.status === 404) {
        $scope.eventSetting = new mvEventSetting();
      }
    });

    $scope.save = function () {
      $scope.eventSetting.$save(function(){
        mvNotifier.notify('面试设置已保存');
      });
    };
  });