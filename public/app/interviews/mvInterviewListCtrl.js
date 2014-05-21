'use strict';

angular.module('compass')
  .controller('mvInterviewListCtrl', function ($scope, mvInterview) {
    $scope.interviews = mvInterview.unprocessed();
  });