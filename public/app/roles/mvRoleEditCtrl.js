angular.module('compass')
  .controller('mvRoleEditCtrl', function ($scope, mvRole, mvIdentity, $routeParams, menuPermissions, $location, mvNotifier) {

    function hasPermission(permission) {
      return $scope.role.permissions.indexOf(permission) > -1;
    }

    function initializePermissions() {

      if (hasPermission('*')) {
        $scope.allChecked = true;
        $scope.onCheckAllChanged();
      } else {
        angular.forEach($scope.menuPermissions, function (menu) {
          menu.enabled = hasPermission(menu.name);
          if (menu.submenus) {
            angular.forEach(menu.submenus, function (submenu) {
              submenu.enabled = hasPermission(submenu.name);
            });
          }
        });
      }
    }

    $scope.menuPermissions = menuPermissions;
    mvRole.get({_id: $routeParams.id}, function (role) {
      $scope.role = role;
      initializePermissions();
    });

    $scope.onMenuCheckChanged = function (menu) {
      if (menu.submenus) {
        angular.forEach(menu.submenus, function (submenu) {
          submenu.enabled = menu.enabled;
        });
      }
    };

    $scope.onCheckAllChanged = function () {
      angular.forEach($scope.menuPermissions, function (menu) {
        menu.enabled = $scope.allChecked;
        $scope.onMenuCheckChanged(menu);
      });
    };

    $scope.onSubmenuCheckChanged = function (menu, submenu) {
      var value = submenu.enabled;
      if (_.every(menu.submenus, 'enabled', function (sub) {
        return sub.enabled === value;
      })) {
        menu.enabled = value;
      }
      else {
        menu.enabled = false;
      }
    };

    $scope.update = function () {
      $scope.role.permissions = _.pluck(_.filter(_.union($scope.menuPermissions, _.flatten($scope.menuPermissions, 'submenus')), function (item) {
        if (item) return item.enabled;
        return false;
      }), 'name');
      $scope.role.$update(function () {
//        if (mvIdentity.currentUser.role)
//          mvPermission.setPermissioins();
        $location.path('/settings/roles');
        mvNotifier.notify('修改角色成功');
      }, function (err) {
        $scope.err = err.data;
        mvNotifier.error('修改角色失败');
      });
    };

    $scope.cancel = function () {
      $location.path('/settings/roles');
    };

  });