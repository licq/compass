'use strict';

var app = angular.module('compass', ['ngCookies', 'ngRoute', 'ngResource', 'ui.bootstrap', 'ui.router', 'compass.system', 'compass.articles']);

angular.module('compass.system', []);
angular.module('compass.articles', []);