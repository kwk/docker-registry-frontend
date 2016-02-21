// app/routes.js

var path = require('path');

module.exports = function (app) {
    // Add route for TODOs
    require('./todos')(app);

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        // load the single view file (angular will handle the page changes
        // on the front-end)
        res.sendFile(path.join(__dirname,'../public/views/', 'index.html'));
    });
};
