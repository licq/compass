angular.module('compass')
    .controller('mvResumeViewCtrl', function ($scope, mvResume, $routeParams) {
        $scope.resume = mvResume.get({_id: $routeParams.id});
    });