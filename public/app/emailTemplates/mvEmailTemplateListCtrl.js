angular.module('compass')
    .controller('mvEmailTemplateListCtrl', function ($scope, mvEmailTemplate, $location) {
        $scope.crumbs = [
            {text: '设置', url: 'settings'},
            {text: '邮件模板', url: 'emailTemplates'}
        ];
        $scope.emailTemplates = mvEmailTemplate.query();

        $scope.gridOptions = angular.extend({
            data: 'emailTemplates',
            columnDefs: [
                {field: 'name', displayName: '名称', width: 180},
                {field: 'subject', displayName: '邮件主题', width: 400},
                {field: 'content', displayName: '邮件内容', width: 500},
                {field: 'actions',
                    displayName: '操作',
                    sortable: false,
                    cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">' +
                        '<edit-button action="edit(row)"></edit-button>' +
                        '<delete-button action="remove(row)"></delete-button>' +
                        '</div>'}
            ]
        }, $scope.gridDefaults);

        $scope.edit = function (row) {
            $location.path('/settings/emailTemplates/edit/' + row.entity._id);
        };

        $scope.remove = function (row) {
            var emailTemplate = row.entity;
            emailTemplate.$delete(function () {
                $scope.emailTemplates.splice(row.rowIndex, 1);
            });
        };
    });