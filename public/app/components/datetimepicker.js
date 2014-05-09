angular.module('ui.datetimepicker',[])
    .directive('datetimepicker', function () {
        function _byDefault(value, defaultValue) {
            function _isSet(value) {
                return !(value === null || value === undefined || isNaN(value) || value === '');
            }

            return _isSet(value) ? value : defaultValue;
        }

        return {
            restrict: 'A',
            require: '?ngModel',

            scope: {
                pickDate: '=',
                pickTime: '=',
                useMinutes: '=',
                useSeconds: '=',
                useCurrent: '=',
                minuteStepping: '=',
                minDate: '=',
                maxDate: '=',
                showToday: '=',
                language: '@',
                defaultDate: '=',
                disabledDates: '=',
                enabledDates: '=',
                icons: '=',
                sideBySide: '=',
                daysOfWeekDisabled: '='
            },

            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) {
                    return;
                }

                element.datetimepicker({
                    pickDate: _byDefault(scope.pickDate, true),
                    pickTime: _byDefault(scope.pickTime, true),
                    useCurrent: _byDefault(scope.useCurrent, true),
                    useMinutes: _byDefault(scope.useMinutes, true),
                    useSeconds: _byDefault(scope.useSeconds, false),
                    minuteStepping: _byDefault(scope.minuteStepping, 5),
                    minDate: _byDefault(scope.minDate, '5/10/2014'),
                    maxDate: _byDefault(scope.maxDate),
                    showToday: _byDefault(scope.showToday, true),
                    language: _byDefault(scope.language, 'zh-cn'),
                    defaultDate: _byDefault(scope.defaultDate, ''),
                    disabledDates: _byDefault(scope.disabledDates, []),
                    enabledDates: _byDefault(scope.enabledDates, []),
                    sideBySide: _byDefault(scope.sideBySide, true),
                    daysOfWeekDisabled: _byDefault(scope.daysOfWeekDisabled, []),
                    icons: _byDefault(scope.icons, {
                        time: 'fa fa-clock-o',
                        date: 'fa fa-calendar-o',
                        up: 'fa fa-chevron-up',
                        down: 'fa fa-chevron-down'
                    })
                });

                ngModel.$render = function () {
                    element.data('DateTimePicker').setDate(ngModel.$viewValue);
                };

                element.on('dp.change', function () {
                    scope.$apply(function () {
                        var newDate = element.data('DateTimePicker').getDate();
                        ngModel.$setViewValue(newDate);
                    });
                });
            }
        };
    });