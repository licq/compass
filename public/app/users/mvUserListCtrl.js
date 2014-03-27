angular.module('compass')
    .controller('mvUserListCtrl', function ($scope, mvUser) {
        $scope.users = mvUser.query();

        $scope.gridOptions = angular.extend({
            data: 'users',
            columnDefs: [
                {field: 'name', displayName: '姓名'},
                {field: 'email', displayName: '邮箱'},
                {field: 'title', displayName: '职位'},
                {field: 'created_at', displayName: '创建时间',cellFilter: 'date:"yyyy/MM/dd HH:mm:ss"'},
                {field: 'deleted',
                    displayName: '状态',
                    cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"> ' +
                        '<status-span value="row.getProperty(col.field)">{{row.getProperty(col.field) | deletedState }}</status-span>' +
                        '</div>'},
                {field: 'actions',
                    displayName: '操作',
                    sortable: false,
                    cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">' +
                        '<edit-button action="edit()"></edit-button>' +
                        '<delete-button action="remove()"></delete-button>' +
                        '</div>'}
            ]
        }, $scope.gridDefaults);

    });