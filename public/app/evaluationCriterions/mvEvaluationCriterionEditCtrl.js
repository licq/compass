angular.module('compass')
    .controller('mvEvaluationCriterionEditCtrl', function ($scope, mvEvaluationCriterion) {
        mvEvaluationCriterion.get(function (criterion) {
            $scope.evaluationCriterion = criterion;
        }, function (res) {
            if (res.status === 404) {
                $scope.evaluationCriterion = {
                    items: [
                        {
                            name: '专业知识', rate: 1
                        },
                        {
                            name: '工作能力', rate: 1
                        },
                        {
                            name: '工作态度', rate: 1
                        },
                        {
                            name: '主动性', rate: 1
                        },
                        {
                            name: '学习能力', rate: 1
                        },
                        {
                            name: '团队合作', rate: 1
                        }
                    ]
                };
            } else {
                $scope.err = res.data;
            }
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