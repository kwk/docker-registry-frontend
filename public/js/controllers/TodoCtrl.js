// public/js/controllers/TodoCtrl.js

'use strict';

angular.module('TodoCtrl', [])
    .controller('TodoController', ['$scope', '$http', 'Todo',

        function ($scope, $http, Todo) {
            $scope.formData = {};

            $scope.fetchTodos = function() {
                console.log("fetching todos...");
                Todo.query(function(todos){
                    $scope.todos = todos;
                });
            }

            // Fetch todos on page load
            $scope.fetchTodos();

            $scope.createTodo = function () {
                console.log("creating todo...");
                Todo.save($scope.formData, function success () {
                    // Reset input field on success
                    $scope.formData.text = '';
                    $scope.fetchTodos();
                }, function error (err) {
                    console.log(err);
                });
            };

            $scope.deleteTodo = function (id) {
                console.log("deleting todos...");
                Todo.delete({id: id}, function success () {
                    $scope.fetchTodos();
                }, function error (err) {
                    console.log(err);
                });
            };

        }
    ]);
