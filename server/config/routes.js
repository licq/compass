'use strict';
var fs = require('fs');

module.exports = function (app) {
    var routes_path = __dirname + '/../routes';
    var walkRoutes = function (path) {
        fs.readdirSync(path).forEach(function (file) {
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);
            if (stat.isFile()) {
                if (/(.*)\.(js$|coffee$)/.test(file)) {
                    require(newPath)(app);
                }
                // We skip the app/routes/middlewares directory as it is meant to be
                // used and shared by routes as further middlewares and is not a
                // route by itself
            } else if (stat.isDirectory() && file !== 'middlewares') {
                walkRoutes(newPath);
            }
        });
    };
    walkRoutes(routes_path);

};