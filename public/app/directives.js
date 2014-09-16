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
  .directive('resetButton', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        action: '&'
      },
      template: '<button class="btn btn-xs btn-success" ng-click="action()"><i class="fa fa-undo"</button> '
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