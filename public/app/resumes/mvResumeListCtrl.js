'use strict';

angular.module('compass')
  .controller('mvResumeListCtrl', function ($scope, mvResume, mvNotifier, $location, states, $http) {
    states.defaults('mvResumeListCtrl', {
      queryOptions: {
        pageSize: 20,
        page: 1
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
      delete $scope.queryOptions.status;

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
    $scope.setStatus = function (status) {
      $scope.queryOptions.status = status;
      $scope.queryOptions.page = 1;
      $scope.query();
    };

    $scope.resetStatus = function (id) {
      mvResume.resetStatus({_id: id}, function () {
          var newStatus;

          var index = -1;
          angular.forEach($scope.resumes, function (resume, i) {
            if (resume._id === id) {
              index = i;
              if (resume.status === 'archived')
                newStatus = '通过';
              else
                newStatus = '面试';
            }
          });

          if (index > -1) {
            $scope.resumes.splice(index, 1);
            $scope.totalResumesCount -= 1;
            mvNotifier.notify('已将简历恢复到' + newStatus + '列表中');
          }
        }
      );
    };
  });