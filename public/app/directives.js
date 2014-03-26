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
    })
    .directive('statusSpan', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                value: '='
            },
            template: '<span class="label" ng-class = "{\'label-success\': !value, \'label-danger\': value}">' +
                '{{value | state}}</span>'
        };
    })
    .directive('viewButton', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                action: '&'
            },
            template: '<button class="btn btn-xs btn-green" ng-click="action()"><i class="fa fa-book"</button> '
        };
    });