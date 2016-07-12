'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:RepositoryDetailController
 * @description
 * # RepositoryDetailController
 * Controller of the docker-registry-frontend
 */
angular.module('repository-detail-controller', ['registry-services', 'app-mode-services'])
  .controller('RepositoryDetailController', ['$scope', '$route', '$routeParams', '$location', '$log', '$modal', 'Repository', 'AppMode',
  function($scope, $route, $routeParams, $location, $log, $modal, Repository, AppMode){

    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    //$scope.searchTerm = $route.current.params.searchTerm;
    $scope.repositoryUser = $route.current.params.repositoryUser;
    $scope.repositoryName = $route.current.params.repositoryName;
    $log.log('repository-detail-controller: $scope.repositoryUser = ' + $scope.repositoryUser);
    if ($scope.repositoryUser == null || $scope.repositoryUser == 'undefined') {
      $scope.repository = $scope.repositoryName;
      $log.log('repository-detail-controller: $scope.repositoryUser was undefined; setting repository to just repositoryName = ' + $scope.repository);
    } else {
      $scope.repository = $scope.repositoryUser + '/' + $scope.repositoryName;
      $log.log('repository-detail-controller: $scope.repositoryUser was NOT undefined; setting repository to ' + $scope.repository);
    }

    $scope.appMode = AppMode.query();
    $scope.maxTagsPage = undefined;

    // Method used to disable next & previous links
    $scope.getNextHref = function (){
      if($scope.maxTagsPage > $scope.tagsCurrentPage){
        var nextPageNumber = $scope.tagsCurrentPage + 1;
        return '/repository/'+$scope.repository+'?tagsPerPage='+ $scope.tagsPerPage +'&tagPage=' +nextPageNumber;
      }
      return '#'
    }
    $scope.getFirstHref = function (){
      if($scope.tagsCurrentPage > 1){
        return '/repository/'+$scope.repository+'?tagsPerPage=' + $scope.tagsPerPage;
      }
      return '#'
    }
    // selected repos
    $scope.selectedRepositories = [];

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
