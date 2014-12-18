'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:DeleteTagController
 * @description
 * # DeleteTagController
 * Controller of the docker-registry-frontend
 */
angular.module('delete-tag-controller', ['registry-services', 'app-mode-services'])
  .controller('DeleteTagController', ['$scope', '$route', '$routeParams', '$location', '$log', '$filter', '$window', 'Tag', 'AppMode',
  function($scope, $route, $routeParams, $location, $log, $filter, $window, Tag, AppMode){
    $scope.repositoryUser = $route.current.params['repositoryUser'];
    $scope.repositoryName = $route.current.params['repositoryName'];
    $scope.tagName = $route.current.params['tagName'];
    $scope.imageId = $route.current.params['imageId'];
    $scope.appMode = AppMode.query();
    
    $scope.deleteTag = function(tag) {
      var tagStr = tag.repoUser + '/' + tag.repoName + ':' + tag.tagName;
      if (!Tag.exists(tag)) {
        toastr.warning('Tag does no longer exist: ' + tagStr);
        return;
      }
      
      Tag.delete(tag,
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
