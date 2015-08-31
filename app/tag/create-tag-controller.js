'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:CreateTagController
 * @description
 * # CreateTagController
 * Controller of the docker-registry-frontend
 */
angular.module('create-tag-controller', ['registry-services', 'app-mode-services'])
  .controller('CreateTagController', ['$scope', '$route', '$routeParams', '$location', '$log', '$filter', '$window', 'Tag', 'Repository', 'AppMode',
  function($scope, $route, $routeParams, $location, $log, $filter, $window, Tag, Repository, AppMode){
    $scope.imageId = $route.current.params.imageId;
    $scope.repositoryUser = $route.current.params.repositoryUser;
    $scope.repositoryName = $route.current.params.repositoryName;

    $scope.master = {};

    $scope.repositories = Repository.query();
    $scope.appMode = AppMode.query();

    $scope.tag = {
      repoUser: $scope.repositoryUser,
      repoName: $scope.repositoryName
    };
    $scope.selectRepo = function(repoStr) {
      var res = repoStr.split('/');
      $scope.tag.repoUser = res[0];
      $scope.tag.repoName = res[1];
    };

    $scope.doCreateTag = function(tag) {
      var tagStr = tag.repoUser + '/' + tag.repoName + ':' + tag.tagName;
      Tag.save(tag, '"'+$scope.imageId+'"',
        // success
        function() {
          toastr.success('Created tag: ' + tagStr);
          // Redirect to new tag page
          $window.location.href = 'tag/' + tag.repoUser + '/' + tag.repoName + '/' + tag.tagName + '/' + $scope.imageId;
        },
        // error
        function(httpResponse) {
          toastr.error('Failed to create tag: ' + tagStr + ' Response: ' + httpResponse.statusText);
        }
      );
    };

    $scope.createTag = function(tag, forceOverwrite) {
      $scope.master = angular.copy(tag);
      var tagStr = tag.repoUser + '/' + tag.repoName + ':' + tag.tagName;
      var tagExists = Tag.exists(tag,
        function() {
          if (!forceOverwrite) {
            toastr.warning('Tag already exists: ' + tagStr);
            return;
          }
          $scope.doCreateTag(tag);
        },
        function(httpResponse) {
          $scope.doCreateTag(tag);
        }
      );
    };

    $scope.isUnchanged = function(tag) {
      return angular.equals(tag, $scope.master);
    };
  }]);
