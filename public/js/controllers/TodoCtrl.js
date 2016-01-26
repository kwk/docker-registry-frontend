// public/js/controllers/TodoCtrl.js

'use strict';

angular.module('TodoCtrl', [])
    .controller('TodoController', ['$scope', '$http', 'Todo',

        function ($scope, $http, Todo) {
            $scope.formData = {};

            // when landing on the page, get all todos and show them
            $scope.todos = Todo.get();

            // when submitting the add form, send the text to the node API
            $scope.createTodo = function () {
                Todo.create($scope.formData);
                /*$http.post('/api/todos', $scope.formData)
                    .success(function (data) {
                        $scope.formData = {}; // clear the form so our user is ready to enter another
                        $scope.todos = data;
                        console.log(data);
                    })
                    .error(function (data) {
                        console.log('Error');
                        console.log(data);
                    });*/
            };

            // delete a todo after checking it
            $scope.deleteTodo = function (id) {
                Todo.delete(id);
                /*$http.delete('/api/todos/' + id)
                      .success(function (data) {
                          $scope.todos = data;
                          console.log(data);
                      })
                      .error(function (data) {
                          console.log('Error: ' + data);
                      });*/
            };

        }
    ]);
