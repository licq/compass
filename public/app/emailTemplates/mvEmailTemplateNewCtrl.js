angular.module('compass')
    .controller('mvEmailTemplateNewCtrl', function ($scope, mvEmailTemplate, $location,mvNotifier) {
        $scope.emailTemplate = new mvEmailTemplate();

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
                mvNotifier.notify('添加邮件模板成功');
            }, function (res) {
                $scope.err = res.data;
                mvNotifier.error('添加邮件模板失败');
            });
        };

        $scope.cancel = function () {
            $location.path('/settings/emailTemplates');
        };
    });