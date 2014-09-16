'use strict';

angular.module('repository-list-directive', [])
  .directive('repositoryList', function(){
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/repository-list-directive.html',
      controller: 'RepositoryController',
    };
  });