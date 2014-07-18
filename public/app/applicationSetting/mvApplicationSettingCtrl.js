angular.module('compass')
  .controller('mvApplicationSettingCtrl', function ($scope, mvApplicationSetting, mvNotifier) {
    $scope.applicationSetting = mvApplicationSetting.get();

    $scope.save = function(){
      mvApplicationSetting.save($scope.applicationSetting,function(){
        mvNotifier.notify('应聘设置保存成功');
      });
    };
  });