// public/models/todo.js
// grab the mongoose module
var mongoose = require('mongoose');

// define our todo model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Todo', new mongoose.Schema({
    text: {
        type: String,
        minlength: 3
            /*validate: {
                validator: function (v) {
                    return /d{3}-d{3}-d{4}/.test(v);
                },
                message: '{VALUE} is not a valid phone number!'
            }*/
    }
}, {
    strict: true // Save only elements specified in this schema
}));
