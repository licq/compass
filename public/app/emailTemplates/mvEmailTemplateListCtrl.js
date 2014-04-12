angular.module('compass')
    .controller('mvEmailTemplateListCtrl', function ($scope, mvEmailTemplate) {
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
                        '<view-button action="view(row.entity)"></view-button>' +
                        '</div>'}
            ],

            afterSelectionChange: function (row) {
                if (row.selected) {
                    $scope.view(row.entity);
                }
            }
        }, $scope.gridDefaults);
    });