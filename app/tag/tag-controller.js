'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:TagController
 * @description
 * # TagController
 * Controller of the docker-registry-frontend
 */
angular.module('tag-controller', ['registry-services'])
  .controller('TagController', ['$scope', '$route', '$routeParams', '$location', '$filter', 'Manifest', 'Tag', 'AppMode', 'filterFilter', '$modal',
  function($scope, $route, $routeParams, $location, $filter, Manifest, Tag, AppMode, filterFilter, $modal){

    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    $scope.searchName = $route.current.params.searchName;
    $scope.repositoryUser = $route.current.params.repositoryUser;
    $scope.repositoryName = $route.current.params.repositoryName;
    if ($scope.repositoryUser == null || $scope.repositoryUser == 'undefined') {
      $scope.repository = $scope.repositoryName;
    } else {
      $scope.repository = $scope.repositoryUser + '/' + $scope.repositoryName;
    }
    $scope.tagName = $route.current.params.tagName;
    AppMode.query(function(result) {
      $scope.appMode = result;
      console.log('$route.current.params.tagsPerPage = ' + $route.current.params.tagsPerPage);
      $scope.tagsPerPage = $route.current.params.tagsPerPage || $scope.appMode.defaultTagsPerPage;
      if ($scope.tagsPerPage == 'all') {
        $scope.tagsPerPage = null;
      }
    });

    // Fetch tags
    $scope.tags = Tag.query({
      repoUser: $scope.repositoryUser,
      repoName: $scope.repositoryName
    }, function(result){
      // Determine the number of pages
      $scope.maxTagsPage = parseInt(Math.ceil(parseFloat(result.length)/parseFloat($scope.tagsPerPage)));
      // Compute the right current page number
      $scope.tagsCurrentPage = $route.current.params.tagPage;
      if(! $scope.tagsCurrentPage){
        $scope.tagsCurrentPage = 1;
      }else{
        $scope.tagsCurrentPage = parseInt($scope.tagsCurrentPage)
        if($scope.tagsCurrentPage > $scope.maxTagsPage || $scope.tagsCurrentPage < 1){
          $scope.tagsCurrentPage = 1;
        }
      }
      // Select wanted tags
      var idxShift = 0;
      $scope.displayedTags = $scope.tags;
      if($scope.tagsPerPage){
        idxShift = ($scope.tagsCurrentPage - 1) * $scope.tagsPerPage;
        $scope.displayedTags = $scope.displayedTags.slice(idxShift, ($scope.tagsCurrentPage ) * $scope.tagsPerPage );
      }
      var tmpIdx;
      // Fetch wanted manifests
      for (var idx in $scope.displayedTags){
        if(!isNaN(idx)){
          tmpIdx = parseInt(idx) + idxShift;
          if ( result[tmpIdx].hasOwnProperty('name') ) {
              Manifest.query({repoUser: $scope.repositoryUser, repoName: $scope.repositoryName, tagName: result[tmpIdx].name})
              .$promise.then((function(tmpIdx){
              return function(data){
                        // FIXME: delete property 'history' because it will occur recursive checks in the process of watching $displayedTags
                        // will this result in some bad things?
                        if(data.history) delete data.history;
                        result[tmpIdx].details = data;
                      };
            })(tmpIdx));
          }
        }
      }
    });

    // Copy collection for rendering in a smart-table
    $scope.displayedTags = [].concat($scope.tags);

    // selected tags
    $scope.selection = [];

    $scope.$watch("displayedTags|filter:{selected: true}", function(nv){
      $scope.selection = nv;
    }, true);

    // select all tags in the page
    $scope.$watch("selectAll", function(nv){
      angular.forEach($filter('filter')($scope.displayedTags, $scope.search), function(elem){
        elem.selected = nv;
      });
    });

    // reset tags that are not in the filter result
    $scope.resetTags = function(){
      var filterResult = $filter('filter')($scope.displayedTags, $scope.search),
          i = 0,
          j = 0;

      while(i<$scope.displayedTags.length && j<filterResult.length){
        if($scope.displayedTags[i] != filterResult[j]){
          $scope.displayedTags[i]['selected'] = false;
          i++;
        }
        else{
          i++, j++;
        }
      }
      while(i<$scope.displayedTags.length) {
        $scope.displayedTags[i]['selected'] = false;
        i++;
      }
    }

    // helper method to get selected tags
    $scope.selectedTags = function selectedTags() {
      return filterFilter($scope.displayedTags, { selected: true });
    };

    $scope.openConfirmTagDeletionDialog = function(size) {
      var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'modalConfirmDeleteItems.html',
          controller: 'DeleteTagsController',
          size: size,
          resolve: {
            items: function () {
              return $scope.selection;
            },
            information: function() {
              return 'A tag is basically a reference to an image. \
                      If no references to an image exist, the image will be \
                      scheduled for automatic deletion. \
                      That said, if you remove a tag, you remove a reference to an image. \
                      Your image data may get lost, if no other tag references it. \
                      Are you sure, you want to delete the following tags?';
            }
          }
      });
    };

  }]);
