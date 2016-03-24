'use strict';

angular.module('registry-host-services', ['ngResource'])
  .factory('RegistryHost', ['$resource', function($resource){
    return $resource('/registry-host.json', {}, {
      'query': {
        method:'GET',
        isArray: false,
      },
    });
  }]);
