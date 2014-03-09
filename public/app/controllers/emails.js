'use strict';

angular.module('compass').controller('EmailListController', function ($scope) {
    $scope.emails = [
        {email: 'job@jinjiang.com', totalResumes: 43, lastTime: '2013-4-30', active: true},
        {email: 'job@jinjiang.com', totalResumes: 42, lastTime: '2013-3-30', active: false},
        {email: 'job@jinjiang.com', totalResumes: 40, lastTime: '2013-2-30', active: true},
        {email: 'job@jinjiang.com', totalResumes: 22, lastTime: '2013-1-30', active: true}
    ];
    $scope.gridOptions = angular.extend({
        data: 'emails',
        columnDefs: [
            {field: 'email', displayName: 'Email'},
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
                cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><edit-button></edit-button>' +
                    '<delete-button action="remove(row)"></delete-button></div>'}
        ]
    }, $scope.gridDefaults);

    $scope.remove = function (row) {
        var index = $scope.emails.indexOf(row.entity);
        if (confirm('真的要删除' + $scope.emails[index].email + '吗？')) {
            $scope.emails.splice(index, 1);
        }
    };
});