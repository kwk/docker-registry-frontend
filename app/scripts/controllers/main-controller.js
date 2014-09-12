'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:MainController
 * @description
 * # MainController
 * Controller of the docker-registry-frontend
 */
angular.module('main-controller', ['docker-service'])
  .controller('MainController', [
    '$scope',
    '$route',
    '$routeParams',
    '$location',
    '$log',
    'docker',
    function($scope, $route, $routeParams, $location, $log, docker){
      this.$route = $route;
      this.$location = $location;
      this.$routeParams = $routeParams;
    }]);