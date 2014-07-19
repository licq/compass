angular.module('compass')
  .controller('mvApplicationViewCtrl', function ($scope, mvApplication, $rootScope, $routeParams, states, $http, $window, $location, mvNotifier, applicationStatusMap, $modal) {
    $scope.index = $routeParams.index;
    $scope.clicked = false;
    $scope.listQueryOptions = states.get('mvApplicationListCtrl' + $routeParams.status).queryOptions || {};

    function retrieveApplication() {
      var queryConditions = angular.extend(
        {},
        $scope.listQueryOptions, {
          pageSize: 1,
          page: $scope.index,
          status: $routeParams.status
        });

      $http.get('/api/applications', {params: queryConditions}).success(function (result) {
        if (result.hits && result.hits.hits && result.hits.hits.length === 1) {
          $scope.totalApplicationCount = result.hits.total;
          $scope.resume = result.hits.hits[0];
          $scope.title = $scope.resume.name;
          $scope.mailHtml = '/api/mails/' + $scope.resume.mail + '/html';
        } else {
          $location.path('/applications/' + $routeParams.status);
        }
      });
    }

    retrieveApplication();

    $scope.pursue = function () {
      $scope.clicked = true;
      mvApplication.pursue({_id: $scope.resume._id}, function () {
        var from = $routeParams.status, to = 'pursued';
        $rootScope.$broadcast('applicationStatusUpdated', from, to);
        mvNotifier.notify('已将' + $scope.resume.name + '加入面试列表');
        retrieveApplication();
      });
    };

    $scope.undetermine = function () {
      $scope.clicked = true;
      mvApplication.undetermine({_id: $scope.resume._id}, function () {
        $rootScope.$broadcast('applicationStatusUpdated', $routeParams.status, 'undetermined');
        mvNotifier.notify('已将' + $scope.resume.name + '加入待定列表');
        retrieveApplication();
      });
    };

    $scope.archive = function () {
      $scope.clicked = true;
      mvApplication.archive({_id: $scope.resume._id}, function () {
        $rootScope.$broadcast('applicationStatusUpdated', $routeParams.status, 'archived');
        mvNotifier.notify('已将' + $scope.resume.name + '归档到人才库中');
        retrieveApplication();
      });
    };

    $scope.newEvent = function () {
      var newEventModal = $modal.open({
        templateUrl: '/app/events/new.html',
        controller: 'mvEventNewCtrl',
        keyboard: false,
        resolve: {
          event: function () {
            return {
              name: $scope.resume.name,
              email: $scope.resume.email,
              mobile: $scope.resume.mobile,
              application: $scope.resume._id,
              applyPosition: $scope.resume.applyPosition
            };
          }
        }
      });

      newEventModal.result.then(function (id) {
        if (id) {
          $scope.clicked = true;
          $rootScope.$broadcast('applicationStatusUpdated', 'pursued', 'interview');
          retrieveApplication();
        }
      });
    };

    $scope.cancel = function () {
      $location.path('/applications/' + $routeParams.status).hash($scope.index);
    };

    $scope.original = false;

    $scope.print = function () {
      $scope.original = true;
      setTimeout(function () {
        $window.frames['mail-frame'].focus();
        $window.frames['mail-frame'].print();
      }, 500);
    };
  });