'use strict';
angular.module('compass')
  .factory('mvPermission', function ($rootScope, mvIdentity) {
    var permissionList;
    return {
      setPermissions: function () {
        if (mvIdentity.currentUser) {
          permissionList = mvIdentity.currentUser.role.permissions;
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
              (item === '*' && permission[0] !== '#');
          }
          return false;
        });
      }
    };
  });