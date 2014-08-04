'use strict';

// Karma configuration
// Generated on Sat Oct 05 2013 22:00:14 GMT+0700 (ICT)

module.exports = function (config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '../../',


    // frameworks to use
    frameworks: ['mocha', 'chai', 'sinon-chai'],


    // list of files / patterns to load in the browser
    files: [
      'public/vendor/jquery/dist/jquery.min.js',
      'public/vendor/moment/moment.js',
      'public/vendor/d3/d3.min.js',
      'public/scripts/vendors/nv.d3.js',
      'public/vendor/lodash/dist/lodash.min.js',
      'public/vendor/angular/angular.js',
      'public/vendor/angular-mocks/angular-mocks.js',
      'public/vendor/angular-cookies/angular-cookies.js',
      'public/vendor/angular-resource/angular-resource.js',
      'public/vendor/angular-route/angular-route.js',
      'public/vendor/angular-sanitize/angular-sanitize.js',
      'public/vendor/angular-ui-calendar/src/calendar.js',
      'public/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
      'public/vendor/angular-bootstrap/ui-bootstrap.js',
      'public/vendor/toastr/toastr.min.js',
      'public/vendor/select2/select2.min.js',
      'public/vendor/angular-ui-tree/dist/angular-ui-tree.min.js',
      'public/vendor/bootstrap-daterangepicker/daterangepicker.js',
      'public/app/components/daterangepicker.js',
      'public/vendor/angularjs-nvd3-directives/dist/angularjs-nvd3-directives.min.js',
      'public/vendor/trNgGrid/src/js/trNgGrid.js',
      'public/vendor/angular-ui-select2/src/select2.js',
      'public/vendor/textAngular/dist/textAngular-sanitize.min.js',
      'public/vendor/textAngular/dist/textAngular.min.js',
      'public/vendor/ng-file-upload/angular-file-upload.min.js',
      'test/client/app.js',
      'public/app/config.js',
      'public/app/directives.js',
      'public/app/filters.js',
      'public/app/**/!(app).js',
      'node_modules/karma-chai-plugins/node_modules/chai-jquery/chai-jquery.js',
      'test/client/**/*.js'
    ],


    // list of files to exclude
    exclude: [

    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    //reporters: ['progress'],
    reporters: ['progress', 'coverage'],

    // coverage
    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'public/app/**/*.js': ['coverage'],
//            'public/app/services/*.js': ['coverage'],
//            'public/app/services/*.js': ['coverage'],
    },

    coverageReporter: {
      type: 'html',
      dir: 'test/coverage/'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
