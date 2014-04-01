angular.module('compass')
    .controller('mvMailViewCtrl', function ($scope, mvMail, $routeParams, $location) {
        $scope.mail = mvMail.get({_id: $routeParams.id});

        $scope.close = function () {
            $location.path('/mails');
        };

        $scope.parse = function () {
            mvMail.parse({_id: $scope.mail._id});
        };
    });