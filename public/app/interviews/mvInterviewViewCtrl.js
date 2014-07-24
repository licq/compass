angular.module('compass')
  .controller('mvInterviewViewCtrl', function ($scope, $rootScope, $routeParams, mvInterview, $location, mvNotifier, $modal, mvEvent) {
    function retrieveInterview() {
      mvInterview.get({_id: $routeParams.id}, function (interview) {
        $scope.interview = interview;
        $scope.isShowDetail = true;
        sync();
      });
    }

    retrieveInterview();

    function sync() {
      $scope.reviewHeader = [];
      $scope.reviewData = {};
      angular.forEach($scope.interview.reviews, function (review) {
        $scope.reviewData[review.interviewer._id] = {};
        angular.forEach(review.items, function (item) {
          if ($scope.reviewHeader.indexOf(item.name) < 0) {
            $scope.reviewHeader.push(item.name);
          }
          $scope.reviewData[review.interviewer._id][item.name] = item.score;
        });
      });
    }

    $scope.cancel = function () {
      $location.path('/interviews/list');
    };

    $scope.offer = function () {
      mvInterview.update({_id: $scope.interview._id}, {status: 'offered'}, function () {
        $scope.interview.status = 'offered';
        mvNotifier.notify('已将' + $scope.interview.name + '放入Offer列表中');
        $location.path('/interviews/list');
      });
    };
    $scope.reject = function () {
      mvInterview.update({_id: $scope.interview._id}, {status: 'rejected'}, function () {
        $scope.interview.status = 'rejected';
        mvNotifier.notify('已将' + $scope.interview.name + '放入人才库');
        $location.path('/interviews/list');
      });
    };

    $scope.newEvent = function () {
      var interview = $scope.interview;
      var modalInstance = $modal.open({
        templateUrl: '/app/events/new.html',
        controller: 'mvEventNewCtrl',
        resolve: {
          event: function () {
            return {
              name: interview.name,
              applyPosition: interview.applyPosition,
              mobile: interview.mobile,
              email: interview.email,
              application: interview.application,
              countsOfEvents: interview.events.length
            };
          }
        }});

      modalInstance.result.then(retrieveInterview);
    };

    $scope.editEvent = function (event) {
      var interview = $scope.interview;
      var modalInstance = $modal.open({
        templateUrl: '/app/events/new.html',
        controller: 'mvEventNewCtrl',
        resolve: {
          event: function () {
            return {
              _id: event._id,
              countsOfEvents: interview.events.length,
              duration: event.duration,
              application: interview._id,
              startTime: event.startTime,
              interviewers: _.map(event.interviewers, '_id'),
              name: interview.name,
              email: interview.email,
              mobile: interview.mobile,
              applyPosition: interview.applyPosition
            };
          }
        }});

      modalInstance.result.then(retrieveInterview);
    };

    $scope.removeEvent = function (event) {
      mvEvent.remove({_id: event._id}, function () {
        var index = _.find($scope.interview.events, {_id: event._id});
        $scope.interview.events.splice(index, 1);
        mvNotifier.notify('删除面试邀请成功');
        $rootScope.$broadcast('changeOfEvent', 'delete', null, event.startTime);
      });
    };
  });