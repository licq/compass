'use strict';

angular.module('compass')
  .factory('mvSession', function ($resource) {
    return $resource('/publicApi/sessions');
  });