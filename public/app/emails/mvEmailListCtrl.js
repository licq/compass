'use strict';

angular.module('compass')
    .controller('mvEmailListCtrl', function ($scope, mvEmail, $location) {
        $scope.emails = mvEmail.query();
        $scope.gridOptions = angular.extend({
            data: 'emails',
            columnDefs: [
                {field: 'address', displayName: 'Email'},
                {field: 'totalResumes', displayName: '共收取简历数'},
                {field: 'lastTime', displayName: '上次收取时间'},
                {field: 'active',
                    displayName: '状态',
                    cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"> ' +
                        '<status-span value="row.getProperty(col.field)"></status-span>' +
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
        }
    });
