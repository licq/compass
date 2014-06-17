angular.module('compass')
  .controller('mvRoleNewCtrl', function ($scope, $location, mvPermission, mvRole, mvNotifier, menuPermissions) {
    $scope.role = new mvRole();
    $scope.allChecked = false;

    $scope.menuPermissions = menuPermissions;

    $scope.onMenuCheckChanged = function (menu) {
      if (menu.submenus) {
        angular.forEach(menu.submenus, function (submenu) {
          submenu.enabled = menu.enabled;
        });
      }
    };

    $scope.onCheckAllChanged = function () {
      angular.forEach(menuPermissions, function (menu) {
        menu.enabled = $scope.allChecked;
        $scope.onMenuCheckChanged(menu);
      });
    };

    $scope.onSubmenuCheckChanged = function (menu) {
      if (_.some(menu.submenus, 'enabled')) {
        menu.enabled = true;
      }
      else if (_.every(menu.submenus, {'enabled': false})) {
        menu.enabled = false;
      }
    };

    $scope.toggle = function(scope) {
      scope.toggle();
    };

    $scope.create = function () {
      $scope.role.permissions = _.pluck(_.filter(_.union($scope.menuPermissions, _.flatten($scope.menuPermissions, 'submenus')), function (item) {
        if (item) return item.enabled;
        return false;
      }), 'name');
      $scope.role.$save(function () {
        $location.path('/settings/roles');
        mvNotifier.notify('添加角色成功');
      }, function (err) {
        $scope.err = err.data;
        mvNotifier.error('添加角色失败');
      });
    };

    $scope.close = function () {
      $location.path('/settings/roles');
    };
  });
