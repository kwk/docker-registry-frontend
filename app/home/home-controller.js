'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:HomeController
 * @description
 * # HomeController
 * Controller of the docker-registry-frontend
 */
angular.module('home-controller', ['app-mode-services'])
  .controller('HomeController', ['$scope', '$route', '$routeParams', '$location', 'AppMode',
  function($scope, $route, $routeParams, $location, AppMode){
    $scope.appMode = AppMode.query();
  }]);
