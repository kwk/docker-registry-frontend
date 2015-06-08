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
    'image-details-directive',
    'tag-item-controller',    
    'image-controller',
    'create-tag-controller',
    'delete-tags-controller',
    'delete-repository-controller',
    'ui.bootstrap',
    'angular-loading-bar',
    'angularMoment',
    'app-version-services',
    'app-mode-services',
    'smart-table',
    'angular.filter',
    'ui.checkbox'
  ])
  .config(['$routeProvider', '$resourceProvider', 'cfpLoadingBarProvider', '$locationProvider',
      function($routeProvider, $resourceProvider, cfpLoadingBarProvider, $locationProvider){

     $locationProvider.html5Mode(true);

    // Don't show the spinner when making XHR requests.
    // Also, show the bar only if an XHR request takes longer than 50ms.    
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 10; 
    
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;    
    
    $routeProvider.
      when('/home', {
        templateUrl: 'views/home.html',
      }).
      when('/repositories/:searchTerm?', {
        templateUrl: 'views/repository-list.html',
      }).
      when('/repository/:repositoryUser/:repositoryName/', {
        templateUrl: 'views/repository-detail.html',
        controller: 'RepositoryController',
      }).
      when('/repository/:repositoryUser/:repositoryName/tags/:searchName?', {
        templateUrl: 'views/repository-detail.html',
        controller: 'RepositoryController',
      }).
	    when('/about', {
        templateUrl: 'views/about.html',
      }).
      when('/tag/:repositoryUser/:repositoryName/:tagName/:imageId', {
        templateUrl: 'views/tag-detail.html',
        controller: 'TagController',
      }).
      when('/image/:imageId', {
        templateUrl: 'views/image-detail.html',
        controller: 'ImageController',
      }).
      when('/image/:imageId/tag/:repositoryUser?/:repositoryName?', {
        templateUrl: 'views/create-tag.html',
        controller: 'CreateTagController',
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);
