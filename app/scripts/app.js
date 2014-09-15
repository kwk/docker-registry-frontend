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
    'docker-service', // TODO: Maybe the following dependencies are not needed? At least they weren't in the "yo angular" output.
    'registry-services',
    'main-controller',
    'repository-controller',
    'repository-selector-directive',
    'repository-list-directive',
  ])
  .config(['$routeProvider', function($routeProvider){
    $routeProvider.
      when('/home', {
        templateUrl: 'views/home.html',
      }).
      when('/repositories/:searchTerm?', {
        templateUrl: 'views/repository-list.html',
        controller: 'RepositoryController',
      }).
      when('/repository/:repositoryUser/:repositoryName', {
        templateUrl: 'views/repository-detail.html',
        controller: 'RepositoryController',
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);