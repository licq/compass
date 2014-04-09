angular.module('compass')
    .controller('mvResumeViewCtrl', function ($scope, mvResume, $routeParams) {
        mvResume.get({_id: $routeParams.id}, function (resume) {
            $scope.resume = resume;

            $scope.crumbs = [
                {
                    text: '简历列表',
                    url: 'resumes'
                },
                {
                    text: resume.name,
                    url: resume._id
                }
            ];
        });


        $scope.selectMail = function () {
            $scope.mailHtml = $scope.mailHtml || '/api/mails/' + $scope.resume.mail + '/html';
        };
    });