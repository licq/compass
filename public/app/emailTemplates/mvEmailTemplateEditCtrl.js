angular.module('compass')
    .controller('mvEmailTemplateEditCtrl', function ($scope, $routeParams, $location, mvEmailTemplate) {
        mvEmailTemplate.get({_id: $routeParams.id}, function (emailTemplate) {
            $scope.emailTemplate = emailTemplate;
            $scope.crumbs = [
                {text: '设置', url: 'settings'},
                {text: '邮件模板', url: 'emailTemplates'},
                {text: '修改', url: 'edit' + emailTemplate._id}
            ];
        });

        $scope.update = function () {
            $scope.emailTemplate.$update(function () {
                $location.path('/settings/emailTemplates');
            }, function (res) {
                $scope.err = res.data;
            });
        };

        $scope.cancel = function () {
            $location.path('/settings/emailTemplates');
        };
    });