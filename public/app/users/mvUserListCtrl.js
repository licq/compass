angular.module('compass')
  .controller('mvUserListCtrl', function ($scope, mvUser, $location) {
    $scope.users = mvUser.query();

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