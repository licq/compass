'use strict';

// Karma configuration
// Generated on Sat Oct 05 2013 22:00:14 GMT+0700 (ICT)

module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '../../',


        // frameworks to use
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'public/js/jquery.js',
            'public/lib/angular/angular.js',
            'public/lib/angular-mocks/angular-mocks.js',
            'public/lib/angular-cookies/angular-cookies.js',
            'public/lib/angular-resource/angular-resource.js',
            'public/lib/angular-route/angular-route.js',
            'public/lib/angular-ui-router/release/angular-ui-router.js',
            'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
            'public/lib/angular-bootstrap/ui-bootstrap.js',
            'public/lib/ng-grid/ng-grid-2.0.7.min.js',
            'public/app/app.js',
            'public/app/config.js',
            'public/app/directives.js',
            'public/app/filters.js',
            'public/app/services/global.js',
            'public/app/services/articles.js',
            'public/app/controllers/articles.js',
            'public/app/controllers/index.js',
            'public/app/controllers/header.js',
            'public/app/init.js',
            'test/karma/unit/**/*.js'
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
            'public/app/controllers/*.js': ['coverage'],
            'public/app/services/*.js': ['coverage']
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
        browsers: ['Chrome'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};
