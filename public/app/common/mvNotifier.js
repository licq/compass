angular.module('compass')
  .value('mvToastr', toastr)
  .factory('mvNotifier', function (mvToastr) {
    mvToastr.options = {
      closeButton: true,
      showDuration: 300,
      hideDuration: 1000,
      timeOut: 2000,
      extendedTimeOut: 1000,
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut'
    };
    return {
      notify: function (msg) {
        mvToastr.success(msg);
      },
      error: function (msg) {
        mvToastr.error(msg);
      }
    };
  });