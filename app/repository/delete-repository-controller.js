'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:DeleteRepositoryController
 * @description
 * # DeleteRepositoryController
 * Controller of the docker-registry-frontend
 */
angular.module('delete-repository-controller', ['registry-services'])
  .controller('DeleteRepositoryController', ['$scope', '$route', '$modalInstance', '$window', 'Repository', 'items', 'information',
  function($scope, $route, $modalInstance, $window, Repository, items, information){
    $scope.items = items;
    $scope.information = information;

    // Callback that triggers deletion of tags and reloading of page
    $scope.ok = function () {
      angular.forEach($scope.items, function(value, key) {
        var repoStr = value;
        var repoUser = value.split("/")[0];
        var repoName = value.split("/")[1];

        var repo = {
          repoUser: repoUser,
          repoName: repoName
        };

        Repository.delete(repo,
          // success
          function(value, responseHeaders) {
            toastr.success('Deleted repository: ' + repoStr);
          },
          // error
          function(httpResponse) {
            toastr.error('Failed to delete repository: ' + repoStr + ' Response: ' + httpResponse.statusText);
          }
        );
      });

      $modalInstance.close();

      // Go to the repositories page
      $window.location.href = 'repositories';
      $route.reload();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);
