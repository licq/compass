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
            transclude: true,
            scope: {
                value: '='
            },
            template: '<span class="label" ng-class = "{\'label-success\': !value, \'label-danger\': value}" ng-transclude=""></span>'
        };
    })
    .directive('viewButton', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                action: '&'
            },
            template: '<button class="btn btn-xs btn-success" ng-click="action()"><i class="fa fa-archive"</button> '
        };
    })
    .directive('breadcrumbs', function ($compile) {
        var template = '<div class="page-head"> ' +
            '<h2 class="pull-left">主页</h2> ' +
            '<div class="bread-crumb"> ' +
            '<a href="/"><i class="fa fa-home"></i>主页</a> ' +
            '</div> ' +
            '<div class="clearfix"></div> </div>';
        return {
            restrict: 'E',
            replace: true,
            scope: {
                crumbs: '='
            },
            link: function (scope, elem) {
                scope.$watch('crumbs', function () {
                    var currentUrl = '/';
                    elem.html(template);
                    var crumbDiv = elem.find('.bread-crumb');
                    angular.forEach(scope.crumbs, function (crumb) {
                        currentUrl = currentUrl + crumb.url;
                        angular.element('<span class="divider">/</span>').appendTo(crumbDiv);
                        angular.element('<a href=' + currentUrl + '>' + crumb.text + '</a>')
                            .appendTo(crumbDiv);
                        currentUrl += '/';
                    });

                    if (scope.crumbs) {
                        elem.find('h2').text(scope.crumbs[scope.crumbs.length - 1].text);
                    }

                    elem.find('a').last().addClass('bread-current');

                    $compile(elem.contents())(scope);
                });
            }
        };
    })
    .directive('validNumber', function () {
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }

                ngModelCtrl.$parsers.push(function (val) {
                    var clean = val.replace(/[^0-9\.]+/g, '');
                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    return clean;
                });

                element.bind('keypress', function (event) {
                    if (event.keyCode === 32) {
                        event.preventDefault();
                    }
                });
            }
        };
    });