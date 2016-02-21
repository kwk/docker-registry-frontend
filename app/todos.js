// app/todos.js
var Todo = require('./models/todo');
var path = require('path');

module.exports = function (app) {
    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function (req, res) {
        // use mongoose to get all todos in the database
        Todo.find(function (err, todos) {
            if (err) {
                console.log(err);
                res.status(500).send(err)
                return;
            }
             // return all todos in JSON format
            res.json(todos);
        });
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function (req, res) {
        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text: req.body.text,
            done: false
        }, function (err, todo) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
                return;
            }
            res.status(200).send("Todo created");
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function (req, res) {
        Todo.remove({
            _id: req.params.todo_id
        }, function (err, todo) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
                return;
            }
            res.status(200).send("Todo deleted");
        });
    });
};
