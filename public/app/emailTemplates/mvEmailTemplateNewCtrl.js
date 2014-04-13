angular.module('compass')
    .controller('mvEmailTemplateNewCtrl', function ($scope, mvEmailTemplate, $location) {
        $scope.emailTemplate = new mvEmailTemplate();

        $scope.tinymceOptions = {
            language: 'zh_CN',
            height: 500,
            plugins: 'link image table',
            menubar: 'tools table format view insert edit',
            toolbar: 'undo redo | styleselect | bold italic | link image | alignleft aligncenter alignright | insertName | insertApplyPosition',
            content_css: '/css/tinymce-content.css',
            setup: function (ed) {
                ed.addButton('insertName', {
                    text: '插入姓名',
                    icon: false,
                    onclick: function () {
                        ed.focus();
                        ed.execCommand('mceInsertContent', false, '{{name}}');
                    }
                });
                ed.addButton('insertApplyPosition', {
                    text: '插入应聘职位',
                    icon: false,
                    onclick: function () {
                        ed.focus();
                        ed.execCommand('mceInsertContent', false, '{{applyPosition}}');
                    }
                });
            }
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

        $scope.cancel = function () {
            $location.path('/settings/emailTemplates');
        };
    });