'use strict';

angular.module('compass')
  .factory('mvSignup', function ($resource) {
    return $resource('/publicApi/signups/:code',
      {code: '@code'}, {
        activate: {
          method: 'PUT'
        }
      });
  });