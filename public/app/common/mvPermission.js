'use strict';
angular.module('compass')
  .factory('mvPermission', function ($rootScope, mvIdentity) {
    var permissionList;
    return {
      setPermissions: function () {
        if (mvIdentity.currentUser) {
          permissionList = mvIdentity.currentUser.role.permissions;
          console.log('pl',permissionList);
        } else {
          permissionList = [];
        }
        $rootScope.$broadcast('permissionsChanged');
      },
      hasPermission: function (permission) {
        if (_.isString(permission))
          permission = permission.trim();

        return _.some(permissionList, function (item) {
          if (_.isString(item)) {
            item = item.trim();
            return item === permission ||
              item === '*';
          }
          return false;
        });
      }
    };
  });