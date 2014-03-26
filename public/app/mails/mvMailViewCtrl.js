angular.module('compass')
    .controller('mvMailViewCtrl', function ($scope, mvMail, $routeParams) {
        $scope.mail = mvMail.get({_id: $routeParams.id});
    });