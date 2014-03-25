'use strict';

angular.module('compass')
    .controller('mvMailListCtrl', function ($scope, mvMail) {
        $scope.mails = mvMail.query();
        $scope.gridOptions = angular.extend({
            data: 'mails',
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
                        '<edit-button action="edit()"></edit-button>' +
                        '<delete-button action="remove()"></delete-button>' +
                        '</div>'}
            ]
        }, $scope.gridDefaults);
    });
