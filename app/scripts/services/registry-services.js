'use strict';

// This is the main entrypoint to interact with the Docker registry.

// Helpful resources
// 
// https://docs.angularjs.org/tutorial/step_11
// https://docs.angularjs.org/api/ngResource/service/$resource

angular.module('registry-services', ['ngResource'])
  .factory('Repository', ['$resource', '$log',  function($resource){
    var url = '/v1/search?q=:searchTerm';
    var paramDefaults = {
        searchTerm: ''
    };
    var actions = {
      query: {
        method:'GET',
        params:{searchTerm:''},
        isArray: true,
        transformResponse: function(data, headers){
          return angular.fromJson(data).results;
        }
      }
    };
    return $resource(url, paramDefaults, actions);
  }]);

/*
    
    function fetchTags(repoPath) {
      $log.info('Searching for tags in repository = '+ repoPath);
      $http.get(urlPrefix+'/v1/repositories/'+repoPath+'/tags').
      success(function(data, status) {
        $log.info('Successfully fetched tags');
        tags[repoPath] = data;
      }).
      error(function(data, status) {
        $log.error('Failed to fetch tags. status='+status+' data='+data);
      });
    }
    
    function getTagsForRepo(repoPath){
      if (repoPath && tags.hasOwnProperty(repoPath)) {
        return tags[repoPath];
      }
      return {};
    }
    
    var data = {
      'urlPrefix': urlPrefix,
      'getRepositories': getRepositories,
      'selectRepository': selectRepository,
      'isSelectedRepository': isSelectedRepository,
      'getSelectedRepository': getSelectedRepository,
      'fetchRepositories': fetchRepositories,
      'getSearchTerm': getSearchTerm,
      'fetchTags': fetchTags,
      'getTagsForRepo': getTagsForRepo,
    };
    
    // This initalizes the docker repo data
    fetchRepositories('');
    
    return data;
    
  }]);
*/