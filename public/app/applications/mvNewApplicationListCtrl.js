angular.module('compass')
    .controller('mvNewApplicationListCtrl', function ($scope, states, mvApplication) {
        $scope.crumbs = [{
            text: '新应聘',
            url: '/applications/new'
        }];
        states.defaults('mvNewApplicationListCtrl', {
            pagingOptions: {
                pageSizes: [10, 20, 50],
                pageSize: 50,
                currentPage: 1
            },
            filterOptions: {
                filterText: '',
                useExternalFilter: true
            }
        });

        $scope.states = states.get('mvNewApplicationListCtrl');

        $scope.totalCount = 0;

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
            ],

            afterSelectionChange: function (row) {
                if (row.selected) {
                    $scope.view(row.entity);
                }
            }
        }, $scope.gridDefaults);

        $scope.getApplications = function (pageSize, page, searchText) {
            mvApplication.query({pageSize: pageSize, page: page, searchText: searchText, status: 'new'}, function (applications, responseHeaders) {
                $scope.totalCount = parseInt(responseHeaders('totalCount'), 10);
                $scope.applications = applications;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
        };


        $scope.getApplications($scope.states.pagingOptions.pageSize, $scope.states.pagingOptions.currentPage);

        $scope.$watch('states', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                if (newVal.pagingOptions.pageSize !== oldVal.pagingOptions.pageSize) {
                    $scope.states.pagingOptions.currentPage = 1;
                }
                $scope.getApplications($scope.states.pagingOptions.pageSize, $scope.states.pagingOptions.currentPage,
                    $scope.states.filterOptions.filterText);
            }
        }, true);

    });