angular.module('compass')
    .controller('mvNewApplicationViewCtrl', function ($scope, mvApplication, $routeParams) {
        mvApplication.get({_id: $routeParams.id}, function (resume) {
            $scope.resume = resume;
            $scope.crumbs = [{text: '新应聘', url: 'applications/new'},
                {text: $scope.resume.name, url: $scope.resume._id}];
        });

        $scope.selectMail = function () {
            $scope.mailHtml = $scope.mailHtml || '/api/mails/' + $scope.resume.mail + '/html';
            console.log($scope.mailHtml);
        };

    });