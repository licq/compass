angular.module('compass')
    .controller('mvEventNewCtrl', function ($scope, $modalInstance, mvUser) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        $scope.today = today;

        $scope.users = [];

        $scope.users = mvUser.query();
        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });