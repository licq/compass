angular.module('compass')
.factory('mvNav', function($resource){
   return $resource('/api/counts');
  });