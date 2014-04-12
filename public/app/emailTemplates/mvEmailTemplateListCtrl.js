angular.module('compass')
    .controller('mvEmailTemplateListCtrl', function ($scope, mvEmailTemplate) {
        $scope.crumbs = [
            {text: '设置', url: 'settings'},
            {text: '邮件模板', url: 'emailTemplates'}
        ];
        $scope.emailTemplates = mvEmailTemplate.query();
    });