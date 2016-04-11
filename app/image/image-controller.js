'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:ImageController
 * @description
 * # ImageController
 * Controller of the docker-registry-frontend
 */
angular.module('image-controller', ['registry-services', 'app-mode-services'])
  .controller('ImageController', ['$scope', '$route', '$routeParams', '$location', '$log', '$filter', 'Manifest', 'AppMode',
  function($scope, $route, $routeParams, $location, $log, $filter, Manifest, AppMode){
    

    $scope.appMode = AppMode.query();
    $scope.totalImageSize = 0;
    $scope.imageDetails = Manifest.query({repoUser: $scope.repositoryUser, repoName: $scope.repositoryName, tagName: $scope.tagName});
    



    // This is not totally working right now (problem with big layers)
    /**
     * Calculates the total download size for the image based on
     * it's layers.
     */
    /*
    $scope.totalImageSize = null;
    $scope.calculateTotalImageSize = function() {
      $scope.totalImageSize = 0;
      var size;
      angular.forEach($scope.imageDetails.fsLayers, function (id, key) {

        Blob.query({repoUser: $scope.repositoryUser, repoName: $scope.repositoryName, digest: id.blobSum}).$promise.then( function(data, headers){
          size = data;
          console.log(data)
          console.log(size)
          if(!isNaN(data.contentLength-0)){
            $scope.totalImageSize += data.contentLength;
          }
        });
      });
    };
    */
    
  }]);
