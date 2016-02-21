// public/js/appRoutes.js

'use strict';

angular.module('appRoutes', [])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'MainController'
            })
            .when('/todos', {
                templateUrl: 'views/todos.html',
                controller: 'TodoController'
            });

        $locationProvider.html5Mode(true);

    }]);
