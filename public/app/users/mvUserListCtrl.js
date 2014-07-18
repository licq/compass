angular.module('compass')
  .controller('mvUserListCtrl', function ($scope, mvApplicationSetting, mvUser, $location) {
    mvUser.query(function (users) {
      $scope.users = users;
      mvApplicationSetting.get({fields: 'positionRightControlled'}, function (settings) {
        $scope.settings = settings;
      });
    });

    $scope.remove = function (user) {
      if (confirm('真的要删除' + user.name + '吗？')) {
        user.$delete(function () {
          user.deleted = true;
        });
      }
    };

    $scope.edit = function (user) {
      $location.path('/settings/users/edit/' + user._id);
    };
  });