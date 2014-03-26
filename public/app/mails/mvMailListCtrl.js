'use strict';

angular.module('compass')
    .controller('mvMailListCtrl', function ($scope, mvMail,$location) {
        $scope.filterOptions = {
            filterText: '',
            useExternalFilter: true
        };
        $scope.totalMailsCount = 0;
        $scope.pagingOptions = {
            pageSizes: [10, 20, 50],
            pageSize: 10,
            currentPage: 1
        };

        $scope.gridOptions = angular.extend({
            data: 'mails',
            enablePaging: true,
            totalServerItems: 'totalMailsCount',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,

            columnDefs: [
                {field: 'mailbox', displayName: '收件箱'},
                {field: 'fromName', displayName: '发件人'},
                {field: 'fromAddress', displayName: '发件箱'},
                {field: 'subject', displayName: '主题'},
                {field: 'date', displayName: '时间', cellFilter: 'date:"yyyy/MM/dd HH:mm:ss"'},
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
                $scope.mails = mails;
                $scope.totalMailsCount = parseInt(responseHeaders('totalCount'), 10);
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };


        $scope.getMails($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                if (newVal.pageSize !== oldVal.pageSize) $scope.pagingOptions.currentPage = 1;
                $scope.getMails($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);
        $scope.$watch('filterOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getMails($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);

        $scope.view = function (mail) {
            $location.path('/mails/' + mail._id);
        };
    });
