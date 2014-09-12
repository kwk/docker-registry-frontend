'use strict';

angular.module('repository-selector-directive', ['docker-service'])
  .directive('repositorySelector', function(){
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/repository-selector-directive.html',      
      controller: function($scope, docker) {        
        $scope.getRepositories = docker.getRepositories;        
        $scope.selectRepository = function(repo) {
          docker.selectRepository(repo);
        }
        $scope.isSelectedRepository = function(repo) {
          return docker.isSelectedRepository(repo);
        }
      },
    };
  });