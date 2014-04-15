angular.module('compass')
    .value('mvToastr', toastr)
    .factory('mvNotifier', function (mvToastr) {
        return {
            notify: function (msg) {
                mvToastr.success(notify);
                console.log(msg);
            },
            error: function (msg) {
                mvToastr.error(msg);
                console.log(msg);
            }
        }
    });