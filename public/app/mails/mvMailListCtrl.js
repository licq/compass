'use strict';

angular.module('compass')
    .controller('mvMailListCtrl', function ($scope, mvMail, $location, states) {
        $scope.crumbs = [
            {text: '邮件列表', url: 'mails'}
        ];
        states.defaults('mvMailListCtrl', {
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

        $scope.states = states.get('mvMailListCtrl');

        $scope.totalMailsCount = 0;

        $scope.gridOptions = angular.extend({
            data: 'mails',
            enablePaging: true,
            totalServerItems: 'totalMailsCount',
            pagingOptions: $scope.states.pagingOptions,
            filterOptions: $scope.states.filterOptions,

            columnDefs: [
                {field: 'mailbox', displayName: '收件箱', width: 180},
                {field: 'fromName', displayName: '发件人', width: 100},
                {field: 'fromAddress', displayName: '发件箱', width: 180},
                {field: 'subject', displayName: '主题', width: 350},
                {field: 'date', displayName: '时间', cellFilter: 'longDate', width: 150},
                {field: 'actions',
                    displayName: '操作',
                    sortable: false,
                    cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">' +
                        '<view-button action="view(row.entity)"></view-button>' +
                        '</div>'}
            ]
        }, $scope.gridDefaults);

        $scope.getMails = function (pageSize, page, searchText) {
            mvMail.query({pageSize: pageSize, page: page, searchText: searchText}, function (mails, responseHeaders) {
                $scope.totalMailsCount = parseInt(responseHeaders('totalCount'), 10);
                $scope.mails = mails;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
        };


        $scope.getMails($scope.states.pagingOptions.pageSize, $scope.states.pagingOptions.currentPage);

        $scope.$watch('states', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                if (newVal.pagingOptions.pageSize !== oldVal.pagingOptions.pageSize) {
                    $scope.states.pagingOptions.currentPage = 1;
                }
                $scope.getMails($scope.states.pagingOptions.pageSize, $scope.states.pagingOptions.currentPage,
                    $scope.states.filterOptions.filterText);
            }
        }, true);

        $scope.view = function (mail) {
            $location.path('/mails/' + mail._id);
        };
    })
;
