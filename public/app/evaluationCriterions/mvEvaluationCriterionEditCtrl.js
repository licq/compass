angular.module('compass')
  .controller('mvEvaluationCriterionEditCtrl', function ($scope, mvEvaluationCriterion, mvNotifier) {
    mvEvaluationCriterion.get(function (criterion) {
      $scope.evaluationCriterion = criterion;
      $scope.item = {};
    }, function (res) {
      $scope.err = res.data;
    });

    $scope.gridOptions = angular.extend({
      data: 'evaluationCriterion.items',
      columnDefs: [
        {field: 'name', displayName: '名称', width: 500, enableCellEdit: true},
        {field: 'rate', displayName: '系数', width: 150, enableCellEdit: true,
          editableCellTemplate: '<input ng-input="COL_FIELD" ng-model="COL_FIELD" valid-number=""></input>'},
        {field: 'actions',
          displayName: '操作',
          sortable: false,
          cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">' +
            '<delete-button action="remove(row)"></delete-button>' +
            '</div>'}
      ]
    }, $scope.gridDefaults, {showFooter: false});

    $scope.remove = function (entity) {
      angular.forEach($scope.evaluationCriterion.items, function (item, index) {
        if (item.name === entity.name) {
          $scope.evaluationCriterion.items.splice(index, 1);
        }
      });
    };

    $scope.add = function () {
      $scope.adding = true;
    };

    $scope.cancel = function () {
      $scope.adding = false;
    };

    $scope.create = function () {
      $scope.adding = false;
      $scope.evaluationCriterion.items.push($scope.item);
      $scope.item = {};
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