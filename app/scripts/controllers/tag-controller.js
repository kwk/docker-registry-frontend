'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:TagController
 * @description
 * # TagController
 * Controller of the docker-registry-frontend
 */
angular.module('tag-controller', ['registry-services'])
  .controller('TagController', ['$scope', '$route', '$routeParams', '$location', '$log', '$filter', 'Tag',
  function($scope, $route, $routeParams, $location, $log, $filter, Tag){
  
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    
    $scope.searchName = $route.current.params['searchName'];
    $scope.repositoryUser = $route.current.params['repositoryUser'];
    $scope.repositoryName = $route.current.params['repositoryName'];
    $scope.repository = $scope.repositoryUser + '/' + $scope.repositoryName;
      
    $scope.tags = Tag.query({
      repoUser: $scope.repositoryUser,
      repoName: $scope.repositoryName
    });
    
    // Copy collection for rendering in a smart-table
    $scope.displayedTags = [].concat($scope.tags);
  }]);