angular.module('compass')
    .controller('mvMainCtrl', function ($scope) {
        $scope.enlarged = false;
        $scope.enlarge = function () {
            console.log($scope.enlarged);
            $scope.enlarged = !$scope.enlarged;
        };
    });