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
    });