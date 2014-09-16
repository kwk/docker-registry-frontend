'use strict';

// This is the main entrypoint to interact with the Docker registry.

// Helpful resources
// 
// https://docs.angularjs.org/tutorial/step_11
// https://docs.angularjs.org/api/ngResource/service/$resource

angular.module('registry-services', ['ngResource'])
  .factory('Repository', ['$resource', '$log',  function($resource, $log){
    return $resource('/v1/search?q=:searchTerm', {}, {
      query: { method:'GET', params:{searchTerm:''}, isArray: true, transformResponse: function(data, headers){
        return angular.fromJson(data).results;
      }},
    });
  }])
  .factory('Tag', ['$resource', '$log',  function($resource, $log){
    return $resource('/v1/repositories/:repo/tags', {}, {
      query: { method:'GET', params:{repo:''}, isArray: true, transformResponse: function(data, headers){
        var res = [];
        var resp = angular.fromJson(data);
        for (var i in resp){
          res.push({name: i, imageId: resp[i]});
        }
        return res;
      }},
    });
  }]);