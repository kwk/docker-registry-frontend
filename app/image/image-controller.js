'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:ImageController
 * @description
 * # ImageController
 * Controller of the docker-registry-frontend
 */
angular.module('image-controller', ['registry-services', 'app-mode-services'])
  .controller('ImageController', ['$scope', '$route', '$routeParams', '$location', '$log', '$filter', 'Manifest', 'Blob', 'AppMode',
  function($scope, $route, $routeParams, $location, $log, $filter, Manifest, Blob, AppMode){

    $scope.appMode = AppMode.query();
    $scope.details = Manifest.query({repoUser: $scope.repositoryUser, repoName: $scope.repositoryName, tagName: $scope.tagName});

    $scope.config = {};
    $scope.details.$promise.then(function(data) {
      $scope.config = Blob.query({repoUser: $scope.repositoryUser, repoName: $scope.repositoryName, digest: data.config.digest});
    });

  }]);
