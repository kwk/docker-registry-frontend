'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:MainController
 * @description
 * # MainController
 * Controller of the docker-registry-frontend
 */
angular.module('main-controller', [])
  .controller('MainController', [
    '$scope',
    '$route',
    '$routeParams',
    '$location',
    '$log',
    function($scope, $route, $routeParams, $location, $log){
      this.$route = $route;
      this.$location = $location;
      this.$routeParams = $routeParams;
    }]);