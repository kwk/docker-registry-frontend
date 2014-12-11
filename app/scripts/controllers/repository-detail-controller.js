'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:RepositoryDetailController
 * @description
 * # RepositoryController
 * Controller of the docker-registry-frontend
 */
angular.module('repository-detail-controller', ['app-mode-services'])
  .controller('RepositoryDetailController', ['$scope', '$route', '$routeParams', '$location', 'AppMode',
  function($scope, $route, $routeParams, $location, AppMode){

    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    $scope.searchTerm = $route.current.params['searchTerm'];
    $scope.repositoryUser = $route.current.params['repositoryUser'];
    $scope.repositoryName = $route.current.params['repositoryName'];
    $scope.repository = $scope.repositoryUser + '/' + $scope.repositoryName;

    $scope.appMode = AppMode.query();
  }]);
