// public/js/services/TodoService.js
angular.module('TodoService', ['ngResource'])
  .factory('Todo', ['$resource', function ($resource) {
    return $resource('/api/todos', {}, {
        // See https://docs.angularjs.org/api/ngResource/service/$resource
        // for a list of methods that are implemented by default (incl.
        // get, save, query, remove, delete).
        delete: {
            url: '/api/todos/:id',
            method: 'DELETE',
        }
    });
  }]);
