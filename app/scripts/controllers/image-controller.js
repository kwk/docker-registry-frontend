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
    /**
     * Calculates the total download size for the image based on
     * it's ancestry.
     */
    $scope.totalImageSize = null;
    $scope.calculateTotalImageSize = function() {
      $scope.totalImageSize = 0;
      angular.forEach($scope.imageAncestry, function (id, key) {
        Image.get( {imageId: id} ).$promise.then(function (result) {
          if (!isNaN(result.Size-0)) {    
            $scope.totalImageSize += result.Size;
          }
        });
      });
    };
  }]);