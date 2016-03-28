'use strict';

// This allows the application to query information about its mode.
// The "app-mode.json" file will be build during "docker build".

angular.module('app-mode-services', ['ngResource'])
  .factory('AppMode', ['$resource', '$log',  function($resource, $log){
    return $resource('app-mode.json', {}, {
      'query': {
        method:'GET',
        isArray: false,
        cache: false
      },
    });
  }]);
