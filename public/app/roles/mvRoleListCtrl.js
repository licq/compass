angular.module('compass')
  .controller('mvRoleListCtrl', function ($scope, mvRole, $location, mvNotifier) {
    $scope.roles = mvRole.query();

    $scope.remove = function (role) {
      if (confirm('真的要删除' + role.name + '吗？')) {
        role.$delete(function () {
          _.forEach($scope.roles, function (r, i) {
            if (r._id === role._id) {
              $scope.roles.splice(i,1);
              return false;
            }
          });
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