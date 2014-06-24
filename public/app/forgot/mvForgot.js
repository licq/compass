angular.module('compass')
  .factory('mvForgot', function ($resource) {
    return $resource('/publicApi/forgot/',{},
      {reset: {
        method: 'PUT',
        isArray: false
      }});
  });