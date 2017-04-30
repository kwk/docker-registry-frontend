'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:DeleteTagsController
 * @description
 * # DeleteTagsController
 * Controller of the docker-registry-frontend
 */
angular.module('delete-tags-controller', ['registry-services'])
  .controller('DeleteTagsController', ['$scope', '$route', '$modalInstance', '$window', 'Manifest', 'items', 'information',
  function($scope, $route, $modalInstance, $window, Manifest, items, information)
  {
    $scope.items = items;
    $scope.information = information;

    // Callback that triggers deletion of tags and reloading of page
    $scope.ok = function () {
      angular.forEach($scope.items, function(value) {
        var repository = value.split(":")[0];
        var tagName = value.split(":")[1];

        Manifest.query({
          repository: repository,
          tagName: tagName
        }).$promise.then(function (data) {
          Manifest.delete({
            repository: repository,
            digest: data.digest
          }).$promise.then(function () {
            $window.location.href = '/repository/' + repository;
          });
        });
      });
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);
