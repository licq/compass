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

    $scope.eventSetting = mvEventSetting.get();

    $scope.save = function () {
      mvEventSetting.save($scope.eventSetting, function () {
        mvNotifier.notify('面试设置已保存');
      });
    };

    $scope.tinymceOptions = angular.extend({
      toolbar: 'undo redo | styleselect | bold italic | link image | alignleft aligncenter alignright | insertName insertApplyPosition insertStartTime insertEndTime',
      setup: function (ed) {
        ed.addButton('insertName', {
          text: '插入姓名',
          icon: false,
          onclick: function () {
            ed.focus();
            ed.execCommand('mceInsertContent', false, '{{姓名}}');
          }
        });
        ed.addButton('insertApplyPosition', {
          text: '应聘职位',
          icon: false,
          onclick: function () {
            ed.focus();
            ed.execCommand('mceInsertContent', false, '{{应聘}}');
          }
        });
        ed.addButton('insertStartTime', {
          text: '开始时间',
          icon: false,
          onclick: function () {
            ed.focus();
            ed.execCommand('mceInsertContent', false, '{{开始时间}}');
          }
        });
        ed.addButton('insertEndTime', {
          text: '结束时间',
          icon: false,
          onclick: function () {
            ed.focus();
            ed.execCommand('mceInsertContent', false, '{{结束时间}}');
          }
        });
      }
    }, $scope.tinymceOptions);
  });