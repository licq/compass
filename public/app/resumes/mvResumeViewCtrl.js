angular.module('compass')
    .controller('mvResumeViewCtrl', function ($scope, mvResume, $routeParams) {
        $scope.resume = mvResume.get({_id: $routeParams.id});

        $scope.setMailHtml = function(){
            $scope.mailHtml = $scope.mailHtml || '/api/mails/' + $scope.resume.mail + '/html';
        }
    });