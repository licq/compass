angular.module('compass')
    .controller('mvEvaluationCriterionEditCtrl', function ($scope, mvEvaluationCriterion) {
        mvEvaluationCriterion.get(function (criterion) {
            $scope.evaluationCriterion = criterion;
        }, function (res) {
            $scope.err = res.data;
        });

        $scope.crumbs = [
            {
                text: '设置',
                url: 'settings'
            },
            {
                text: '面试评价',
                url: 'evaluationCriterion'
            }
        ];

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

        $scope.remove = function (row) {
            $scope.evaluationCriterion.items.splice(row.rowIndex, 1);
        };

        $scope.add = function () {
            $scope.evaluationCriterion.items.push({
                name: '双击进行修改',
                rate: 1
            });
        };

        $scope.save = function () {
            $scope.evaluationCriterion.$update();
        };
    });