// public/js/services/TodoService.js
angular.module('TodoService', [])
    .factory('Todo', ['$http', function ($http) {

        return {
            // call to get all todos
            get: function () {
                return $http.get('/api/todos')
                    .success(function (data) {
                        console.log(data);
                    })
                    .error(function (data) {
                        console.log('Error: ' + data);
                    });
            },


            // these will work when more API routes are defined on the Node side of things
            // call to POST and create a new todo
            create: function (todoData) {
                return $http.post('/api/todos', $scope.formData)
                    .success(function (data) {
                        $scope.formData = {}; // clear the form so our user is ready to enter another
                        $scope.todos = data;
                        console.log(data);
                    })
                    .error(function (data) {
                        console.log('Error');
                        console.log(data);
                    });
            },

            // call to DELETE a todo
            delete: function (id) {
                return $http.delete('/api/todos/' + id)
                    .success(function (data) {
                        $scope.todos = data;
                        console.log(data);
                    })
                    .error(function (data) {
                        console.log('Error: ' + data);
                    });
            }
        }

    }]);
