angular.module('compass')
    .controller('mvMailViewCtrl', function ($scope, mvMail, $routeParams,$location) {
        $scope.mail = mvMail.get({_id: $routeParams.id});

        $scope.close = function(){
            $location.path('/mails');
        };
    });