angular.module('compass')
  .controller('mvRoleListCtrl', function ($scope, mvRole, $location, mvNotifier) {
    $scope.roles = mvRole.query();

    $scope.remove = function (role) {
      if (confirm('真的要删除' + role.name + '吗？')) {
        role.$delete(function () {
          var index = -1;
          angular.forEach($scope.roles, function (r, i) {
            if (r._id === role._id) {
              index = i;
            }
          });
          if (index > -1) {
            $scope.roles.splice(index, 1);
          }
          mvNotifier.notify('删除角色成功');
        }, function (err) {
          $scope.err = err.data;
          mvNotifier.error(err.data.message, '删除角色失败');
        });
      }
    };

    $scope.edit = function (role) {
      $location.path('/settings/roles/edit/' + role._id);
    };
  }
);