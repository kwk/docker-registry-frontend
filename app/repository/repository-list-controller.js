'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:RepositoryListController
 * @description
 * # RepositoryListController
 * Controller of the docker-registry-frontend
 */
angular.module('repository-list-controller', ['registry-services', 'app-mode-services'])
  .controller('RepositoryListController', ['$scope', '$route', '$routeParams', '$location', '$modal', 'Repository', 'AppMode',
  function($scope, $route, $routeParams, $location, $modal, Repository, AppMode){
    // Default values which will be populated later
    $scope.nextLink = ""
    $scope.lastPage = false
    $scope.selectedRepositories = [];
    
    // Given an object which may not exist, return the value or a default
    var get_or_default = function(thing, def) {
        if(typeof thing !== 'undefined') {
            return thing 
        } else {
            return def
        }
    }

    // Retrieve the last item of an arrary
    var last = function(arr) {
        return arr[arr.length - 1]
    }

    $scope.appMode = AppMode.query( function (result){
      $scope.defaultTagsPerPage = result.defaultTagsPerPage
    });
    
    // Retrieve (optional) route parameters
    $scope.reposPerPage = get_or_default($route.current.params.reposPerPage, 20) 
    $scope.lastNamespace = get_or_default($route.current.params.lastNamespace, "")
    $scope.lastRepository = get_or_default($route.current.params.lastRepository, "")

    // Query for the registry for a list of repositories
    var queryObject = {};
    queryObject['n'] = $scope.reposPerPage;
    if ($scope.lastNamespace && $scope.lastRepository) {
      queryObject['last'] = ''+$scope.lastNamespace+'/'+$scope.lastRepository;
    }
    else if($scope.lastNamespace) {
      queryObject['last'] = ''+$scope.lastNamespace;
    }
    $scope.repositories = Repository.query(queryObject);

    // helper method to get selected tags
    $scope.selectedRepos = function selectedRepos() {
      return filterFilter($scope.repositories.repos, { selected: true });
    };

    // Watch repos for changes
    // To watch for changes on a property inside the object "repositories"
    // we first have to make sure the promise is ready.
    $scope.repositories.$promise.then(function(data) {
      var lastRepo = last(data.repos)
      $scope.nextLink = "" + $scope.reposPerPage + "/" + lastRepo.name
      $scope.lastPage = data.lastPage
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
    
    // Traverse to the next list page 
    $scope.nextPage = function() {
        $location.path("/repositories/" + $scope.nextLink)
    }
  }]);
