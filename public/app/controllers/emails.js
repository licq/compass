'use strict';

angular.module('compass')
    .controller('EmailListController', function ($scope, Email) {
        $scope.emails = Email.query();
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
                        '<edit-button></edit-button>' +
                        '<delete-button action="remove(row)"></delete-button>' +
                        '</div>'}
            ]
        }, $scope.gridDefaults);

        $scope.remove = function (row) {
            var index = $scope.emails.indexOf(row.entity);
            if (confirm('真的要删除' + $scope.emails[index].email + '吗？')) {
                $scope.emails.splice(index, 1);
            }
        };
    })
    .controller('EmailNewController', function ($scope, $location, Email) {
        $scope.email = new Email({
            port: 110
        });

        $scope.create = function () {
            $scope.email.$save(function () {
                $location.path('/emails');
            });
        };
    });

