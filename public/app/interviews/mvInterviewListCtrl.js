'use strict';

angular.module('compass')
  .controller('mvInterviewListCtrl', function ($scope, mvInterview) {
    $scope.crumbs = [
      {text: '待评价', url: 'interviews/unprocessed'}
    ];

    $scope.interviews = mvInterview.unprocessed();
  });