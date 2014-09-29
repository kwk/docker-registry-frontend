'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:TagDetailController
 * @description
 * # TagDetailController
 * Controller of the docker-registry-frontend
 */
angular.module('tag-detail-controller', [])
  .controller('TagDetailController', ['$scope', '$route', '$routeParams', '$location', 'RegistryHost',
  function($scope, $route, $routeParams, $location, RegistryHost){
  
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    
    $scope.tagName = $route.current.params['tagName'];
    $scope.imageId = $route.current.params['imageId'];
    $scope.repositoryUser = $route.current.params['repositoryUser'];
    $scope.repositoryName = $route.current.params['repositoryName'];
    $scope.repository = $scope.repositoryUser + '/' + $scope.repositoryName;
    
    $scope.registryHost = RegistryHost.query();
  }]);