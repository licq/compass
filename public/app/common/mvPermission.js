'use strict';
angular.module('compass')
  .factory('mvPermission', function ($rootScope, mvIdentity) {
    var permissionList;
    return {
      setPermissions: function () {
        if (mvIdentity.currentUser) {
          permissionList = mvIdentity.currentUser.permissions;
        } else {
          permissionList = [];
        }
        $rootScope.$broadcast('permissionsChanged');
      },
      hasPermission: function (permission) {
        permission = permission.trim();
        return _.some(permissionList, function (item) {
          if (_.isString(item))
            return item.trim() === permission;
        });
      }
    };
  });