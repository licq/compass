'use strict';

angular.module('compass')
    .controller('mvEmailListCtrl', function ($scope, mvEmail, $location) {
        $scope.crumbs = [
            {text: '简历邮箱', url: 'emails'}
        ];
        $scope.emails = mvEmail.query();
        $scope.gridOptions = angular.extend({
            data: 'emails',
            columnDefs: [
                {field: 'address', displayName: 'Email'},
                {field: 'totalRetrieveCount', displayName: '共收取邮件数'},
                {field: 'lastRetrieveCount', displayName: '上次收取邮件数'},
                {field: 'lastRetrieveTime', displayName: '上次收取时间', cellFilter: 'date:"yyyy/MM/dd HH:mm:ss"'},
                {field: 'lastError',
                    displayName: '状态',
                    cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"> ' +
                        '<status-span value="row.getProperty(col.field)">{{row.getProperty(col.field) | state}}</status-span>' +
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

        $scope.remove = function () {
            var index = this.row.rowIndex;
            var email = $scope.emails[index];
            if (confirm('真的要删除' + email.address + '吗？')) {
                email.$delete(function () {
                    $scope.emails.splice(index, 1);
                });
            }
        };

        $scope.edit = function () {
            var index = this.row.rowIndex;
            $location.path('/emails/edit/' + $scope.emails[index]._id);
        };
    });
