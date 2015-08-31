'use strict';

angular.module('repository-selector-directive', [])
  .directive('repositorySelector', function(){
    return {
      restrict: 'E',
      templateUrl: 'repository/repository-selector-directive.html',      
      controller: 'RepositoryController',
    };
  });
