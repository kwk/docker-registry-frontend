'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:DeleteRepositoryController
 * @description
 * # DeleteRepositoryController
 * Controller of the docker-registry-frontend
 */
angular.module('delete-repository-controller', ['registry-services'])
  .controller('DeleteRepositoryController', ['$scope', '$route', '$q', '$modalInstance', '$window', 'Repository', 'items', 'information',
  function($scope, $route, $q, $modalInstance, $window, Repository, items, information){
    $scope.items = items;
    $scope.information = information;

    // Callback that triggers deletion of tags and reloading of page
    $scope.ok = function () {
      var requests = [];

      angular.forEach($scope.items, function(value, key) {
        var repoStr = value;
        var repoUser = value.split("/")[0];
        var repoName = value.split("/")[1];

        var repo = {
          repoUser: repoUser,
          repoName: repoName
        };

        var deferred = $q.defer();
        requests.push(deferred.promise);

        var success = function() {
          toastr.success('Deleted repository: ' + repoStr);
          deferred.resolve();
        }

        var fail = function(httpResponse) {
          toastr.error('Failed to delete repository: ' + repoStr + ' Response: ' + httpResponse.statusText);
          deferred.reject();
        }

        Repository.delete(repo, success, fail);

      });
      $q.all(requests).then(function(){
        $modalInstance.close();
        $window.location.href = '#/repositories';
        $route.reload();
      });

    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);
