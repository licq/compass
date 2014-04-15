angular.module('compass')
    .value('mvToastr', toastr)
    .factory('mvNotifier', function (mvToastr) {
        mvToastr.options.closeButton = true;
        return {
            notify: function (msg) {
                mvToastr.success(msg);
                console.log(msg);
            },
            error: function (msg) {
                mvToastr.error(msg);
                console.log(msg);
            }
        };
    });