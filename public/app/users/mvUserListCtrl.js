angular.module('compass')
  .controller('mvUserListCtrl', function ($scope, $filter, mvApplicationSetting, mvUser, $location, $window) {
    mvUser.query(function (users) {
      $scope.users = users;
      $scope.showDeleted = false;
      $scope.refreshDisplay();
      mvApplicationSetting.get({fields: 'positionRightControlled'}, function (settings) {
        $scope.settings = settings;
      });
    });

    $scope.refreshDisplay = function () {
      $scope.displayUsers = $filter('filter')($scope.users, function (user) {
        user.positions = $filter('orderBy')(user.positions, 'name');
        return !user.deleted || $scope.showDeleted;
      });
    };

    $scope.remove = function (user) {
      if ($window.confirm('真的要删除' + user.name + '吗？')) {
        user.$delete(function () {
          user.deleted = true;
          $scope.refreshDisplay();
        });
      }
    };

    $scope.enable = function (user) {
      user.$enable(function () {
        user.deleted = false;
        $scope.refreshDisplay();
      });
    };

    $scope.edit = function (user) {
      $location.path('/settings/users/edit/' + user._id);
    };
  });