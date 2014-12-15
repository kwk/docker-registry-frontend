'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:RepositoryDetailController
 * @description
 * # RepositoryDetailController
 * Controller of the docker-registry-frontend
 */
angular.module('repository-detail-controller', ['app-mode-services'])
  .controller('RepositoryDetailController', ['$scope', '$route', '$routeParams', '$location', 'AppMode',
  function($scope, $route, $routeParams, $location, AppMode){
    $scope.appMode = AppMode.query();
  }]);
