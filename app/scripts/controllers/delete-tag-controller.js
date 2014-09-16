'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:DeleteTagController
 * @description
 * # DeleteController
 * Controller of the docker-registry-frontend
 */
angular.module('delete-tag-controller', ['registry-services'])
  .controller('DeleteTagController', ['$scope', '$route', '$routeParams', '$location', '$log', '$filter', '$window', 'Tag',
  function($scope, $route, $routeParams, $location, $log, $filter, $window, Tag){
    $scope.repositoryUser = $route.current.params['repositoryUser'];
    $scope.repositoryName = $route.current.params['repositoryName'];
    $scope.tagName = $route.current.params['tagName'];
    $scope.imageId = $route.current.params['imageId'];

    $scope.master = {};
    
    $scope.deleteTag = function(tag, forceOverwrite) {
      $scope.master = angular.copy(tag);
      var tagStr = tag.repoUser + '/' + tag.repoName + ':' + tag.tagName;
      if (!Tag.exists(tag)) {
        toastr.warning('Tag does no longer exist: ' + tagStr);
        return;
      }
      
      Tag.delete(tag, '"'+$scope.imageId+'"',
        // success
        function(value, responseHeaders) {
          toastr.success('Deleted tag: ' + tagStr);
          // Redirect to new tag page
          $window.location.href = '#/repository/' + tag.repoUser + '/' + tag.repoName;
        },
        // error
        function(httpResponse) {
          toastr.error('Failed to delete tag: ' + tagStr + ' Response: ' + httpResponse);
        }
      );
    };
  }]);