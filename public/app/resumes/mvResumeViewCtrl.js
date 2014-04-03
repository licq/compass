angular.module('compass')
    .controller('mvResumeViewCtrl', function ($scope, mvResume, $routeParams, $location) {
        $scope.resume = mvResume.get({_id: $routeParams.id});
    });