angular.module('compass')
  .controller('mvApplicationListCtrl',
  function ($scope, states, mvApplication, $http, $window, $location, $routeParams, applicationStatusMap, $modal) {
    $scope.title = applicationStatusMap[$routeParams.status];

    states.defaults('mvApplicationListCtrl' + $routeParams.status, {
      queryOptions: {
        pageSize: 50,
        page: 1
      }
    });

    $scope.initialized = false;

    $scope.totalApplicationCount = 999;
    $scope.queryOptions = states.get('mvApplicationListCtrl' + $routeParams.status).queryOptions;
    $scope.queryOptions.status = $routeParams.status;

    $scope.query = function () {
      $http.get('/api/applications', {params: $scope.queryOptions}).success(function (result) {
        $scope.totalApplicationCount = result.hits.total;
        $scope.applications = result.hits.hits;
        $scope.facets = result.facets;
        $scope.initialized = true;
      });
    };

    function oneMore() {
      if ($scope.totalApplicationCount > $scope.queryOptions.page * $scope.queryOptions.pageSize) {
        var queryOption = angular.extend(
          {},
          $scope.queryOptions,
          {
            pageSize: 1,
            page: $scope.queryOptions.page * $scope.queryOptions.pageSize
          });

        $http.get('/api/applications', {params: queryOption}).success(function (result) {
          if (result.hits.hits && result.hits.hits.length > 0) {
            $scope.applications.push(result.hits.hits[0]);
          }
        });
      }
    }

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

    $scope.showPagination = function () {
      return $scope.totalApplicationCount > $scope.queryOptions.pageSize && $scope.initialized;
    };

    function removeLocal(id) {
      var index = -1;
      angular.forEach($scope.applications, function (application, i) {
        if (application._id === id) {
          index = i;
        }
      });

      if (index > -1) {
        $scope.applications.splice(index, 1);
        $scope.totalApplicationCount -= 1;
      }
    }

    $scope.archive = function (id) {
      if ($window.confirm('确认将该应聘简历归档？归档后的简历可在人才库找到')) {
        mvApplication.archive({_id: id}, function () {
          removeLocal(id);
          oneMore();
        });
      }
    };

    $scope.pursue = function (id) {
      mvApplication.pursue({_id: id}, function () {
        removeLocal(id);
        oneMore();
      });
    };

    $scope.undetermine = function (id) {
      mvApplication.undetermine({_id: id}, function () {
        removeLocal(id);
        oneMore();
      });
    };

    $scope.view = function (index) {
      index += $scope.queryOptions.pageSize * ($scope.queryOptions.page - 1);
      index += 1;
      $location.path('/applications/' + $routeParams.status + '/' + index);
    };

    $scope.newEvent = function (application) {
      var newEventModal = $modal.open({
        templateUrl: '/app/events/new.html',
        controller: 'mvEventNewCtrl',
        keyboard: false,
        resolve: {
          event: function () {
            return {
              name: application.name,
              application: application._id,
              email: application.email,
              mobile: application.mobile,
              applyPosition: application.applyPosition
            };
          }
        }
      });

      newEventModal.result.then(function (event) {
        if (event) {
          removeLocal(event.application);
          oneMore();
        }
      });
    };

    $scope.query();

  });