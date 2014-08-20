angular.module('compass')
  .controller('mvUserListCtrl', function ($scope, mvApplicationSetting, mvUser, $location, $window) {
    mvUser.query(function (users) {
      $scope.users = users;
      $scope.showDeleted = false;
      $scope.deletedUsers = _.filter($scope.users, {deleted: true});
      $scope.normalUsers = _.filter($scope.users, {deleted: false});
      $scope.displayUsers = $scope.normalUsers;
      mvApplicationSetting.get({fields: 'positionRightControlled'}, function (settings) {
        $scope.settings = settings;
      });
    });

    $scope.refreshDisplay = function () {
      if ($scope.showDeleted === true) {
        $scope.displayUsers = $scope.normalUsers.concat($scope.deletedUsers);
      }
      else {
        $scope.displayUsers = $scope.normalUsers;
      }
    };

    $scope.remove = function (user) {
      if ($window.confirm('真的要删除' + user.name + '吗？')) {
        user.$delete(function () {
          _.forEach($scope.normalUsers, function (u, index) {
            if (u._id === user._id) {
              $scope.normalUsers.splice(index, 1);
              return false;
            }
          });
          user.deleted = true;
          $scope.deletedUsers.push(user);
          $scope.refreshDisplay();
        });
      }
    };

    $scope.enable = function (user) {
      user.$enable(function () {
        _.forEach($scope.deletedUsers, function (u, index) {
          if (u._id === user._id) {
            $scope.deletedUsers.splice(index, 1);
            return false;
          }
        });
        user.deleted = false;
        $scope.normalUsers.push(user);
        $scope.refreshDisplay();
      });
    };

    $scope.edit = function (user) {
      $location.path('/settings/users/edit/' + user._id);
    };
  });