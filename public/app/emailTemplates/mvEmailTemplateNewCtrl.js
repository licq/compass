angular.module('compass')
    .controller('mvEmailTemplateNewCtrl', function ($scope, mvEmailTemplate, $location) {
        $scope.emailTemplate = new mvEmailTemplate();

        $scope.tinymceOptions = {
            language: 'zh_CN',
            height: 500,
            menubar: 'tools table format view insert edit',
            content_css: '/css/tinymce-content.css'
        };

        $scope.crumbs = [
            {
                text: '设置', url: 'settings'
            },
            {
                text: '邮件模板', url: 'emailTemplates'
            },
            {
                text: '新增', url: 'new'
            }
        ];

        $scope.create = function () {
            $scope.emailTemplate.$save(function () {
                $location.path('/settings/emailTemplates');
            }, function (res) {
                $scope.err = res.data;
            });
        };
    });