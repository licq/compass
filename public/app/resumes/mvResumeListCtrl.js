'use strict';

angular.module('compass')
  .controller('mvResumeListCtrl', function ($scope, mvResume, $location, states, $http) {
    states.defaults('mvResumeListCtrl', {
      queryOptions: {
        pageSize: 20,
        page:1
      }
    });

    $scope.queryOptions = states.get('mvResumeListCtrl').queryOptions;
    $scope.totalResumesCount = 0;

    $scope.query = function () {
      $http.get('/api/resumes', {params: $scope.queryOptions}).success(function (result) {
        $scope.totalResumesCount = result.hits.total;
        $scope.resumes = result.hits.hits;
        $scope.facets = result.facets;
      });
    };

    $scope.query();

    $scope.view = function (resume) {
      $location.path('/resumes/' + resume._id);
    };

    $scope.search = function () {
      $scope.queryOptions.page = 1;
      delete $scope.queryOptions.applyPosition;
      delete $scope.queryOptions.age;
      delete $scope.queryOptions.highestDegree;

      $scope.query();
    };

    $scope.setApplyPosition = function (applyPosition) {
      $scope.queryOptions.applyPosition = applyPosition;
      $scope.queryOptions.page = 1;
      $scope.query();
    };

    $scope.setAge = function (age) {
      $scope.queryOptions.age = age;
      $scope.queryOptions.page = 1;
      $scope.query();
    };

    $scope.setHighestDegree = function (highestDegree) {
      $scope.queryOptions.highestDegree = highestDegree;
      $scope.queryOptions.page = 1;
      $scope.query();
    };
  });