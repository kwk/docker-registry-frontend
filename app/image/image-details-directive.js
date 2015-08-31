'use strict';

angular.module('image-details-directive', [])
  .directive('imageDetails', function(){
    return {
      restrict: 'E',
      templateUrl: 'image/image-details-directive.html',
      controller: 'ImageController',
    };
  });
