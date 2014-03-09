'use strict';

angular.module('compass')
    .directive('deleteButton', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                action: '&'
            },
            template: '<button class="btn btn-xs btn-danger" ng-click="action()"><i class="fa fa-times"></i></button>'
        };
    })
    .directive('editButton', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                action: '&'
            },
            template: '<button class="btn btn-xs btn-warning" ng-click="action()"><i class="fa fa-pencil"></i></button>'
        };
    });