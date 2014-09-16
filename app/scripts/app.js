'use strict';

/**
 * @ngdoc overview
 * @name docker-registry-frontend
 * @description
 * # docker-registry-frontend
 *
 * Main module of the application.
 */
angular
  .module('docker-registry-frontend', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',    
    'registry-services', // TODO: Maybe the following dependencies are not needed? At least they weren't in the "yo angular" output.
    'main-controller',
    'repository-controller',
    'tag-controller',
    'repository-selector-directive',
    'repository-list-directive',
    'tag-list-directive',
  ])
  .config(['$routeProvider', function($routeProvider){
    $routeProvider.
      when('/home', {
        templateUrl: 'views/home.html',
      }).
      when('/repositories/:searchTerm?', {
        templateUrl: 'views/repository-list.html',
      }).
      when('/repository/:repositoryUser/:repositoryName/:searchName?', {
        templateUrl: 'views/repository-detail.html',
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);