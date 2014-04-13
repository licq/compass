angular.module('compass')
    .controller('mvEmailTemplateNewCtrl', function ($scope, mvEmailTemplate, $location) {
        $scope.emailTemplate = new mvEmailTemplate();

        $scope.tinymceOptions = {
            language: 'zh_CN',
            height: 500,
            plugins: 'link image',
            menubar: 'tools table format view insert edit',
            toolbar: 'undo redo | styleselect | bold italic | link image | alignleft aligncenter alignright | insertName',
            content_css: '/css/tinymce-content.css',
            setup: function (ed) {
                console.log('in setup');
                ed.addButton('insertName', {
                    title: '插入姓名',
                    img: '/img/star.gif',
                    onclick: function () {
                        ed.focus();
                        ed.execCommand('mceInsertContent', false, '{{name}}');
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
    });