angular.module('compass')
  .controller('mvUserListCtrl', function ($scope, mvApplicationSetting, mvUser, $location, $window) {
    mvUser.query(function (users) {
      $scope.users = users;
      mvApplicationSetting.get({fields: 'positionRightControlled'}, function (settings) {
        $scope.settings = settings;
      });
    });

    $scope.remove = function (user) {
      if ($window.confirm('真的要删除' + user.name + '吗？')) {
        user.$delete(function () {
          _.forEach($scope.users, function (u, index) {
            if (u._id === user._id) {
              $scope.users.splice(index,1);
              return false;
            }
          });
        });
      }
    };

    $scope.edit = function (user) {
      $location.path('/settings/users/edit/' + user._id);
    };
  });