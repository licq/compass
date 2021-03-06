/**
 * @license ng-bs-daterangepicker v0.0.1
 * (c) 2013 Luis Farzati http://github.com/luisfarzati/ng-bs-daterangepicker
 * License: MIT
 */
(function (angular) {
  'use strict';

  angular.module('ui.daterangepicker', []).directive('input', function ($compile, $parse) {
    return {
      restrict: 'E',
      require: '?ngModel',
      link: function ($scope, $element, $attributes, ngModel) {
        if ($attributes.type !== 'daterange' || ngModel === null) return;

        var options = {};
        options.format = $attributes.format || 'YYYY年MM月DD日';
        options.separator = $attributes.separator || ' - ';
        options.minDate = $attributes.minDate && moment($attributes.minDate);
        options.maxDate = $attributes.maxDate && moment($attributes.maxDate);
        options.dateLimit = $attributes.limit && moment.duration.apply(this, $attributes.limit.split(' ').map(function (elem, index) {
          return index === 0 && parseInt(elem, 10) || elem;
        }));
        options.ranges = $attributes.ranges && $parse($attributes.ranges)($scope) || {
          '今天': [moment().startOf('day'), moment().endOf('day')],
          '本周': [moment().startOf('week'), moment().endOf('week')],
          '本月': [moment().startOf('month'), moment().endOf('month')],
          '下个月': [moment().startOf('month').add(1,'M'), moment().endOf('month').add(1,'M')]
        };
        options.locale = $attributes.locale && $parse($attributes.locale)($scope) || {
          cancelLabel: '取消',
          applyLabel: '确定',
          fromLabel: '从',
          toLabel: '到',
          weekLabel: '日期',
          customRangeLabel: '时间段',
          daysOfWeek: moment.weekdaysMin(),
          monthNames: moment.monthsShort(),
          firstDay: 0
        };
        options.opens = $attributes.opens && $parse($attributes.opens)($scope);

        function format(date) {
          return date.format(options.format);
        }

        function formatted(dates) {
          return [format(dates.startDate), format(dates.endDate)].join(options.separator);
        }

        ngModel.$formatters.unshift(function (modelValue) {
          if (!modelValue) return '';
          return modelValue;
        });

        ngModel.$parsers.unshift(function (viewValue) {
          return viewValue;
        });

        ngModel.$render = function () {
          if (!ngModel.$viewValue || !ngModel.$viewValue.startDate) return;
          $element.val(formatted(ngModel.$viewValue));
        };

        $scope.$watch($attributes.ngModel, function (modelValue) {
          if (!modelValue || (!modelValue.startDate)) {
            ngModel.$setViewValue({ startDate: moment().startOf('day'), endDate: moment().startOf('day') });
            return;
          }
          $element.data('daterangepicker').startDate = modelValue.startDate;
          $element.data('daterangepicker').endDate = modelValue.endDate;
          $element.data('daterangepicker').updateView();
          $element.data('daterangepicker').updateCalendars();
          $element.data('daterangepicker').updateInputText();
        });

        $element.daterangepicker(options, function (start, end) {
          $scope.$apply(function () {
            ngModel.$setViewValue({ startDate: start, endDate: end });
            ngModel.$render();
          });
        });
      }
    };
  });

})(angular);