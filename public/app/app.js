'use strict';

angular.module('compass', ['ngCookies', 'ngRoute', 'ngResource', 'ui.bootstrap',
    'ui.router', 'ngGrid', 'compass.system', 'compass.articles']);

angular.module('compass.system', []);
angular.module('compass.articles', []);