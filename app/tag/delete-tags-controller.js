'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:DeleteTagsController
 * @description
 * # DeleteTagsController
 * Controller of the docker-registry-frontend
 */
angular.module('delete-tags-controller', ['registry-services'])
  .controller('DeleteTagsController', ['$scope', '$route', '$modalInstance', '$window', 'Tag', 'items', 'information', '$location',
  function($scope, $route, $modalInstance, $window, Tag, items, information, $location)
  {
    $scope.items = items;
    $scope.information = information;
    $scope.repositoryUser = $route.current.params.repositoryUser;
    $scope.repositoryName = $route.current.params.repositoryName;

    // Callback that triggers deletion of tags and reloading of page
    $scope.ok = function () {
      angular.forEach($scope.items, function(value, key) {
        var tagStr = value;
        var tagName = value.split(":")[1];
        var repoUser = value.split("/")[0];
        var repoName = value.split("/")[1].split(":")[0];

        var tag = {
          repoUser: repoUser,
          repoName: repoName,
          tagName: tagName
        };

        if (!Tag.exists(tag)) {
         toastr.warning('Tag does no longer exist: ' + tagStr);
         return;
        }

        Tag.delete(tag,
          // success
          function(value, responseHeaders) {
            toastr.success('Deleted tag: ' + tagStr);
            $location.path('/repository/' + $scope.repositoryUser + '/' + $scope.repositoryName + '/' + $scope.appMode.defaultTagsPerPage);
          },
          // error
          function(httpResponse) {
            toastr.error('Failed to delete tag: ' + tagStr + ' Response: ' + httpResponse.statusText);
          }
        );
      });
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);
