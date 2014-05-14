angular.module('compass')
  .controller('mvApplicationViewCtrl', function ($scope, mvApplication, $routeParams, states, $http, $window, $location, mvNotifier, applicationStatusMap, $modal) {
    $scope.index = $routeParams.index;
    $scope.searchOptions = states.get('mvApplicationListCtrl' + $routeParams.status).searchOptions || {};

    function retrieveApplication() {
      var queryConditions = angular.extend({
        pageSize: 1,
        page: $scope.index,
        status: $routeParams.status
      }, $scope.searchOptions);

      $http.get('/api/applications', {params: queryConditions}).success(function (result) {
        if (result.hits && result.hits.hits && result.hits.hits.length === 1) {
          $scope.totalApplicationCount = result.hits.total;
          $scope.resume = result.hits.hits[0];
          $scope.crumbs = [
            {text: applicationStatusMap[$routeParams.status], url: 'applications/' + $routeParams.status},
            {text: $scope.resume.name, url: $routeParams.index}
          ];
          $window.scrollTo(0, 0);
        } else {
          $location.path('/applications/' + $routeParams.status);
        }
      });
    }

    retrieveApplication();
    $scope.selectMail = function () {
      $scope.mailHtml = $scope.mailHtml || '/api/mails/' + $scope.resume.mail + '/html';
    };

    $scope.pursue = function () {
      mvApplication.pursue({_id: $scope.resume._id}, function () {
        mvNotifier.notify('已将' + $scope.resume.name + '加入面试列表');
        retrieveApplication();
      });
    };

    $scope.undetermine = function () {
      mvApplication.undetermine({_id: $scope.resume._id}, function () {
        mvNotifier.notify('已将' + $scope.resume.name + '加入待定列表');
        retrieveApplication();
      });
    };

    $scope.archive = function () {
      mvApplication.archive({_id: $scope.resume._id}, function () {
        mvNotifier.notify('已将' + $scope.resume.name + '归档到人才库中');
        retrieveApplication();
      });
    };

    $scope.newEvent = function(){
      var newEventModal = $modal.open({
        templateUrl: '/app/interviews/eventNew.html',
        controller: 'mvEventNewCtrl',
        keyboard: false,
        resolve: {
          application: function () {
            return $scope.resume;
          },
          event: false
        }
      });

      newEventModal.result.then(function (id) {
        if (id) {
          retrieveApplication();
        }
      });
    };
  });