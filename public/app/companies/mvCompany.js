angular.module('compass')
  .factory('mvCompany', function ($resource) {
    return $resource('/sysAdminApi/companies/:_id', {_id: '@_id'});
  });