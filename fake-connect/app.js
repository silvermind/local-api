exports.app = function (config) {

    var express = require('express'),
        bower = require('bower');

    bower.config.cwd = __dirname;
    bower.commands.install(null, null, {})
        .on('end', function(){
            console.log('Installed bower dependencies for Fake Connect.');
        });

    var con = express();

    con.use(express.static(__dirname +'/public'));
    con.use('/bower_components', express.static(__dirname +'/bower_components'));

    con.get('/arbiter/', function (req, res) {
        res.sendfile(__dirname+'/public/index.html');
    });

    return con;
};