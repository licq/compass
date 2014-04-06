angular.module('compass')
    .controller('mvMailViewCtrl', function ($scope, mvMail, $routeParams, $location, $sce) {
        $scope.mail = mvMail.get({_id: $routeParams.id}, function (mail) {
            $scope.mail = mail;
            $scope.mail.htmlUrl = $sce.trustAsResourceUrl($scope.mail.htmlUrl);
        });

        $scope.close = function () {
            $location.path('/mails');
        };

        $scope.parse = function () {
            mvMail.parse({_id: $scope.mail._id});
        };
    });