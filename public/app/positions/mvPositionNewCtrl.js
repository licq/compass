angular.module('compass')
  .controller('mvPositionNewCtrl', function ($scope, $location, mvPosition, mvEvaluationCriterion, mvUser, mvNotifier) {
    $scope.dataReady = false;
    mvUser.query(function (users) {
      $scope.users = users;
      $scope.position = new mvPosition();
      mvEvaluationCriterion.get({}, function (res) {
        if (res && res.items) {
          $scope.position.evaluationCriterions = res.items;
        }
        else {
          $scope.position.evaluationCriterions = [];
        }
        $scope.dataReady = true;
        $scope.item = {};
      });
    });

    $scope.adding = false;
    $scope.create = function () {
      $scope.position.$save(function () {
        $location.path('/settings/positions');
        mvNotifier.notify('添加职位成功');
      }, function (err) {
        $scope.err = err.data;
        mvNotifier.error('添加职位失败');
      });
    };

    $scope.remove = function (entity) {
      angular.forEach($scope.position.evaluationCriterions, function (item, index) {
        if (item.name === entity.name) {
          $scope.position.evaluationCriterions.splice(index, 1);
        }
      });
    };

    $scope.add = function () {
      $scope.adding = true;
    };

    $scope.cancel = function () {
      $scope.adding = false;
    };

    $scope.save = function () {
      $scope.position.evaluationCriterions.push($scope.item);
      $scope.item = {};
      $scope.adding = false;
    };

    $scope.close = function () {
      $location.path('/settings/positions');
    };
  });

