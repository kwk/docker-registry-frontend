'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:RepositoryController
 * @description
 * # RepositoryController
 * Controller of the docker-registry-frontend
 */
angular.module('repository-controller', ['registry-services'])
  .controller('RepositoryController', ['$scope', '$route', '$routeParams', '$location', 'Repository',
  function($scope, $route, $routeParams, $location, Repository){
  
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    
    $scope.searchTerm = $route.current.params['searchTerm'];
    $scope.repositoryUser = $route.current.params['repositoryUser'];
    $scope.repositoryName = $route.current.params['repositoryName'];
    $scope.repository = $scope.repositoryUser + '/' + $scope.repositoryName;
  
    $scope.repositories = Repository.query();
  }]);