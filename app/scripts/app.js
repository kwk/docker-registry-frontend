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
    'tag-detail-controller',
    'image-controller',
    'create-tag-controller',
    'delete-tag-controller',
    'delete-repository-controller',
  ])
  .config(['$routeProvider', function($routeProvider){
    $routeProvider.
      when('/home', {
        templateUrl: 'views/home.html',
      }).
      when('/repositories/:searchTerm?', {
        templateUrl: 'views/repository-list.html',
      }).
      when('/repository/:repositoryUser/:repositoryName/', {
        templateUrl: 'views/repository-detail.html',
      }).
      when('/repository/:repositoryUser/:repositoryName/tags/:searchName?', {
        templateUrl: 'views/repository-detail.html',
      }).
      when('/repository/:repositoryUser/:repositoryName/delete', {
        templateUrl: 'views/delete-repository.html',
        controller: 'DeleteRepositoryController',
      }).
	    when('/about', {
        templateUrl: 'views/about.html',
      }).
      when('/tag/:repositoryUser/:repositoryName/:tagName/:imageId', {
        templateUrl: 'views/tag-detail.html',
        controller: 'TagDetailController',
      }).
      when('/tag/:repositoryUser/:repositoryName/:tagName/:imageId/delete', {
        templateUrl: 'views/delete-tag.html',
        controller: 'DeleteTagController',
      }).
      when('/image/:imageId', {
        templateUrl: 'views/image-detail.html',
        controller: 'ImageController',
      }).
      when('/image/:imageId/tag', {
        templateUrl: 'views/create-tag.html',
        controller: 'CreateTagController',
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);