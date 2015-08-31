'use strict';

angular.module('tag-list-directive', [])
  .directive('tagList', function(){
    return {
      restrict: 'E',
      templateUrl: 'tag/tag-list-directive.html',
      controller: 'TagController',
    };
  });
