'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:RepositoryListController
 * @description
 * # RepositoryListController
 * Controller of the docker-registry-frontend
 */
angular.module('repository-list-controller', ['ngRoute', 'ui.bootstrap', 'registry-services', 'app-mode-services'])
  .controller('RepositoryListController', ['$scope', '$route', '$routeParams', '$location', '$modal', 'Repository', 'AppMode',
  function($scope, $route, $routeParams, $location, $modal, Repository, AppMode){

    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    $scope.repositoryUser = $route.current.params.repositoryUser;
    $scope.repositoryName = $route.current.params.repositoryName;
    $scope.repository = $scope.repositoryUser + '/' + $scope.repositoryName;

    AppMode.query(function(result) {
      $scope.appMode = result;
    });
    // How to query the repository
    if ($route.current.params.reposPerPage) {
      $scope.reposPerPage = parseInt($route.current.params.reposPerPage, 10);
    }
    $scope.lastNamespace = $route.current.params.lastNamespace;
    $scope.lastRepository = $route.current.params.lastRepository;
    var queryObject = {};
    if ($scope.reposPerPage) {
      queryObject['n'] = $scope.reposPerPage;
    }
    if ($scope.lastNamespace && $scope.lastRepository) {
      queryObject['last'] = ''+$scope.lastNamespace+'/'+$scope.lastRepository;
    }
    $scope.repositories = Repository.query(queryObject);

    // selected repos
    $scope.selectedRepositories = [];

    // helper method to get selected tags
    $scope.selectedRepos = function selectedRepos() {
      return filterFilter($scope.repositories.repos, { selected: true });
    };

    // Watch repos for changes
    // To watch for changes on a property inside the object "repositories"
    // we first have to make sure the promise is ready.
    $scope.repositories.$promise.then(function(data) {
      $scope.repositories = data;
      $scope.$watch('repositories.repos|filter:{selected:true}', function(nv) {
        $scope.selectedRepositories = nv.map(function (repo) {
          return repo.name;
        });
      }, true);
    });

    $scope.openConfirmRepoDeletionDialog = function(size) {
      var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'modalConfirmDeleteItems.html',
          controller: 'DeleteRepositoryController',
          size: size,
          resolve: {
            items: function () {
              return $scope.selectedRepositories;
            },
            information: function() {
              return 'A repository is a collection of tags. \
                      A tag is basically a reference to an image. \
                      If no references to an image exist, the image will be scheduled for automatic deletion. \
                      That said, if you remove a tag, you remove a reference to an image. \
                      Your image data may get lost, if no other tag references it. \
                      If you delete a repository, you delete all tags associated with it. \
                      Are you sure, you want to delete the following repositories?';
            }
          }
      });
    };

  }]);
