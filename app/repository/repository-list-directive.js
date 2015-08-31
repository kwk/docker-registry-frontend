'use strict';

angular.module('repository-list-directive', [])
  .directive('repositoryList', function(){
    return {
      restrict: 'E',
      templateUrl: 'repository/repository-list-directive.html',
      controller: 'RepositoryController',
    };
  });
