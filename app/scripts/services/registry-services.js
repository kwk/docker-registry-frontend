'use strict';

// This is the main entrypoint to interact with the Docker registry.

// Helpful resources
// 
// https://docs.angularjs.org/tutorial/step_11
// https://docs.angularjs.org/api/ngResource/service/$resource

angular.module('registry-services', ['ngResource'])
  .factory('RegistryHost', ['$resource', '$log',  function($resource, $log){
    return $resource('/registry-host.json', {}, {
      'query': {
        method:'GET',
        isArray: false,
      },
    });
  }])
  .factory('Repository', ['$resource', '$log',  function($resource, $log){
    return $resource('/v1/search?q=:searchTerm', {}, {
      'query': {
        method:'GET',
        isArray: true,
        transformResponse: function(data, headers){
          var res = angular.fromJson(data).results;
          angular.forEach(res, function(value, key) {
            value.username = ""+value.name.split("/")[0];
            value.selected = false;
          });
          return res;
        }
      },
      'delete': {
        url: '/v1/repositories/:repoUser/:repoName/',
        method: 'DELETE',
      },
    });
  }])
  .factory('Tag', ['$resource', '$log',  function($resource, $log){
    // TODO: rename :repo to repoUser/repoString for convenience.
    return $resource('/v1/repositories/:repoUser/:repoName/tags', {}, {
      'query': {
        method:'GET',
        isArray: true,
        transformResponse: function(data, headers){
          var res = [];
          var resp = angular.fromJson(data);
          for (var i in resp){
            res.push({name: i, imageId: resp[i], selected: false});
          }
          return res;
        },
      },
      'delete': {
        url: '/v1/repositories/:repoUser/:repoName/tags/:tagName',
        method: 'DELETE',
      },
      'exists': {
        url: '/v1/repositories/:repoUser/:repoName/tags/:tagName',
        method: 'GET',
        transformResponse: function(data, headers){
          // data will be the image ID if successful or an error object.
          data = angular.isString(angular.fromJson(data));
          return data;
        },
      },
      // Usage: Tag.save({repoUser:'someuser', repoName: 'someRepo', tagName: 'someTagName'}, imageId);
      'save': {
        method:'PUT',
        url: '/v1/repositories/:repoUser/:repoName/tags/:tagName',
      },
    });
  }])
  .factory('Image', ['$resource', '$log',  function($resource, $log){
    return $resource('/v1/images/:imageId/json', {}, {
      'query': { method:'GET', isArray: false},
    });
  }])
  .factory('Ancestry', ['$resource', '$log',  function($resource, $log){
    return $resource('/v1/images/:imageId/ancestry', {}, {
      'query': { method:'GET', isArray: true},
    });
  }]);
