'use strict';

angular.module('image-details-directive', [])
  .directive('imageDetails', function(){
    return {
      restrict: 'E',
      templateUrl: 'scripts/directives/image-details-directive.html',
      controller: 'ImageController',
    };
  });