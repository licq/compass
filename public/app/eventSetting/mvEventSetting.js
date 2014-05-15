angular.module('compass')
  .factory('mvEventSetting', function ($resource) {
    return $resource('/api/eventSetting');
  });