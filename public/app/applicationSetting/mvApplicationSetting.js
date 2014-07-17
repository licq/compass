angular.module('compass')
  .factory('mvApplicationSetting', function ($resource) {
    return $resource('/api/applicationSettings',{},
    {update: {
      method: 'PUT',
        isArray: false
    }});
  });