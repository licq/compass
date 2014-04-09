'use strict';

angular.module('compass')
    .controller('mvResumeListCtrl', function ($scope, mvResume, $location, states) {
        $scope.crumbs = [
            {text: '简历列表', url: 'resumes'}
        ];
        states.defaults('mvResumeListCtrl', {
            pagingOptions: {
                pageSizes: [10, 20, 50],
                pageSize: 10,
                currentPage: 1
            },
            filterOptions: {
                filterText: '',
                useExternalFilter: true
            }
        });

        $scope.states = states.get('mvResumeListCtrl');

        $scope.totalResumesCount = 0;

        $scope.gridOptions = angular.extend({
            data: 'resumes',
            enablePaging: true,
            totalServerItems: 'totalResumesCount',
            pagingOptions: $scope.states.pagingOptions,
            filterOptions: $scope.states.filterOptions,

            columnDefs: [
                {field: 'name', displayName: '姓名', width: 80},
                {field: 'birthday', displayName: '出生日期', width: 100, cellFilter: 'yearAndMonth'},
                {field: 'applyPosition', displayName: '应聘职位', width: 180},
                {field: 'educationHistory[0].school', displayName: '毕业学校', width: 180},
                {field: 'workExperience[0].company', displayName: '所在公司', width: 280},
                {field: 'yearsOfExperience', displayName: '工作年限', width: 80, cellFilter: 'yearsOfExperience'},
                {field: 'channel', displayName: '招聘渠道', width: 80},
                {field: 'actions',
                    displayName: '操作',
                    sortable: false,
                    cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">' +
                        '<view-button action="view(row.entity)"></view-button>' +
                        '</div>'}
            ],
            afterSelectionChange: function (row) {
                if (row.selected) {
                    $scope.view(row.entity);
                }
            }
        }, $scope.gridDefaults);

        $scope.getResumes = function (pageSize, page, searchText) {
            mvResume.query({pageSize: pageSize, page: page, searchText: searchText}, function (resumes, responseHeaders) {
                $scope.totalResumesCount = parseInt(responseHeaders('totalCount'), 10);
                $scope.resumes = resumes;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
        };


        $scope.getResumes($scope.states.pagingOptions.pageSize, $scope.states.pagingOptions.currentPage);

        $scope.$watch('states', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                if (newVal.pagingOptions.pageSize !== oldVal.pagingOptions.pageSize) {
                    $scope.states.pagingOptions.currentPage = 1;
                }
                $scope.getResumes($scope.states.pagingOptions.pageSize, $scope.states.pagingOptions.currentPage,
                    $scope.states.filterOptions.filterText);
            }
        }, true);

        $scope.view = function (resume) {
            $location.path('/resumes/' + resume._id);
        };
    })
;
