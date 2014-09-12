'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:RepositoryController
 * @description
 * # RepositoryController
 * Controller of the docker-registry-frontend
 */
angular.module('repository-controller', ['docker-service'])
  .controller('RepositoryController', ['$scope', '$route', '$routeParams', '$location', '$log', 'docker',
  function($scope, $route, $routeParams, $location, $log, docker){ 
  
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    
    $scope.searchTerm = $route.current.params['searchTerm'];
    $scope.repositoryUser = $route.current.params['repositoryUser'];
    $scope.repositoryName = $route.current.params['repositoryName'];
    $scope.repository = $scope.repositoryUser + '/' + $scope.repositoryName;
  
    $scope.isSelectedRepository = function(repo){
      return docker.isSelectedRepository(repo);
    };
    
    $scope.selectRepository = function(repo){
      docker.selectRepository(repo);
    };
    
    $scope.getSelectedRepository = function(){
      return $route.current.params['repositoryUser']+'/'+$route.current.params['repositoryName'];
    };

    $scope.getRepositories = docker.getRepositories;
    
    $scope.searchRepositories = docker.searchRepositories;
    
    $scope.getSearchTerm = function() {
      $log.info('search term in repo controller is:' + docker.getSearchTerm());
      return docker.getSearchTerm();
    }
    
    $scope.fetchTags = function(repo) {
      return docker.fetchTags(repo);
    }
    
    $scope.getTagsForRepo = function(repo){
      return docker.getTagsForRepo(repo);
    }
  }]);