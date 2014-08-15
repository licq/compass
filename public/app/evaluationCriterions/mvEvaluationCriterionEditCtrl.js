angular.module('compass')
  .controller('mvEvaluationCriterionEditCtrl', function ($scope, mvEvaluationCriterion, mvNotifier) {
    mvEvaluationCriterion.get(function (criterion) {
      $scope.evaluationCriterion = criterion;
    }, function (res) {
      $scope.err = res.data;
    });

    $scope.remove = function (entity) {
      angular.forEach($scope.evaluationCriterion.items, function (item, index) {
        if (item.name === entity.name) {
          $scope.evaluationCriterion.items.splice(index, 1);
          return false;
        }
      });
    };

    $scope.add = function () {
      $scope.adding = true;
      $scope.item = {};
    };

    $scope.cancel = function () {
      $scope.adding = false;
    };

    $scope.create = function () {
      $scope.adding = false;
      $scope.evaluationCriterion.items.push($scope.item);
    };

    $scope.save = function () {
      $scope.evaluationCriterion.$update(function () {
        mvNotifier.notify('修改保存成功');
      }, function (res) {
        $scope.err = res.data;
        mvNotifier.error('修改保存失败');
      });
    };
  });