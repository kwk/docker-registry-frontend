// public/js/controllers/MainCtrl.js
'use strict';

angular.module('MainCtrl', [])
    .controller('MainController', ['$scope', '$http',
        function ($scope, $http) {
            $scope.tagline = "To the moon and back!";
        }
    ]);
