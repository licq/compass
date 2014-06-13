'use strict';
angular.module('compass')
  .factory('mvPermission', function ($rootScope) {
    var permissionList;
    return {
      setPermissions: function(permissions) {
        permissionList = permissions;
        $rootScope.$broadcast('permissionsChanged');
      },
      hasPermission: function (permission) {
        permission = permission.trim();
        return _.some(permissionList, function(item) {
          if(_.isString(item.Name))
            return item.Name.trim() === permission;
        });
      }
    };
  });