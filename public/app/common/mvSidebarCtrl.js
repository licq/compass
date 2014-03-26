'use strict';

angular.module('compass')
    .controller('mvSidebarCtrl', function ($scope, mvIdentity) {
        $scope.identity = mvIdentity;

        $scope.enlarged = false;

        $scope.$on('sidebar:enlarge_changed' ,function(){
            $scope.enlarged = !$scope.enlarged;
        });
    });