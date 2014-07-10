angular.module('compass')
  .controller('mvApplicationListCtrl',
  function ($scope, states, $rootScope, mvApplication, $anchorScroll, $http, $location, $routeParams, applicationStatusMap, $modal, mvNotifier) {
    $scope.title = applicationStatusMap[$routeParams.status];

    states.defaults('mvApplicationListCtrl' + $routeParams.status, {
      queryOptions: {
        pageSize: 50,
        page: 1,
        status: $routeParams.status
      }
    });

    $scope.initialized = false;

    $scope.totalApplicationCount = 999;
    $scope.queryOptions = states.get('mvApplicationListCtrl' + $routeParams.status).queryOptions;

    $scope.query = function () {
      $http.get('/api/applications', {params: $scope.queryOptions}).success(function (result) {
        $scope.totalApplicationCount = result.hits.total;
        $scope.applications = result.hits.hits;
        $scope.facets = result.facets;
        $scope.initialized = true;
      });
    };

    $scope.scroll = function() {

      if($location.hash()){
        var index = $location.hash() - ($scope.queryOptions.page - 1) * $scope.queryOptions.pageSize;
       var item = '#item' + (index - 1);

        var settings = {
          container: 'section',
          scrollTo: item,
          offset: 0,
          duration: 5,
          easing: 'swing'
        };
        var scrollPane = angular.element(settings.container);
        var scrollTo = (typeof settings.scrollTo === 'number') ? settings.scrollTo : angular.element(settings.scrollTo);
        var scrollY = (typeof scrollTo === 'number') ? scrollTo : scrollTo.offset().top - settings.offset;
        scrollPane.animate({scrollTop: scrollY }, settings.duration, settings.easing, function () {
          $location.hash(null);
        });
      }

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
      mvApplication.archive({_id: id}, function () {
          $rootScope.$broadcast('applicationStatusUpdated', $routeParams.status, 'archived');
          mvNotifier.notify('已归档该简历。归档后的简历可在人才库找到。');
          removeLocal(id);
          oneMore();
        }
      );
    };

    $scope.pursue = function (id) {
      mvApplication.pursue({_id: id}, function () {
        var from = $routeParams.status, to = 'pursued';
        $rootScope.$broadcast('applicationStatusUpdated', from, to);
        mvNotifier.notify('已将该简历放入通过列表。');
        removeLocal(id);
        oneMore();
      });
    };

    $scope.undetermine = function (id) {
      mvApplication.undetermine({_id: id}, function () {
        $rootScope.$broadcast('applicationStatusUpdated', $routeParams.status, 'undetermined');
        mvNotifier.notify('已将该简历放入待定列表。');
        removeLocal(id);
        oneMore();
      });
    };

    $scope.view = function (index) {
      index += $scope.queryOptions.pageSize * ($scope.queryOptions.page - 1);
      index += 1;
      $location.path('/applications/' + $routeParams.status + '/' + index).hash('');
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
          $rootScope.$broadcast('applicationStatusUpdated', 'pursued', 'interview');

          removeLocal(event.application);
          oneMore();
        }
      });
    };

    $scope.query();

  });