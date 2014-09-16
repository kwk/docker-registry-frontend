'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:ImageController
 * @description
 * # ImageController
 * Controller of the docker-registry-frontend
 */
angular.module('image-controller', ['registry-services'])
  .controller('ImageController', ['$scope', '$route', '$routeParams', '$location', '$log', '$filter', 'Image', 'Ancestry',
  function($scope, $route, $routeParams, $location, $log, $filter, Image, Ancestry){
    $scope.imageId = $route.current.params['imageId'];
    $scope.imageDetails = Image.query( {imageId: $scope.imageId} );
    $scope.imageAncestry = Ancestry.query( {imageId: $scope.imageId} );
  }]);