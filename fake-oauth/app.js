exports.app = function(config,data){

    var express = require('express');

    var controllers = require('./controllers.js')(config,data);

    var oauth = express();

    oauth.get('/auth', controllers.auth);

    oauth.all('/signin', controllers.signin);

    oauth.get('/logout', controllers.logout);

    //TODO implement /token
    oauth.all('/token', controllers.token);

    return oauth;
};
