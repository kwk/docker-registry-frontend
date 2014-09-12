'use strict';

/**
 * @ngdoc function
 * @name dockerRegistryFrontendApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the dockerRegistryFrontendApp
 */
angular.module('dockerRegistryFrontendApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
