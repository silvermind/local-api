var express = require('express'),
    app = express(),
    _ = require('lodash'),
    ramlParser = require('raml-parser'),
    argv = require('minimist')(process.argv.slice(2))
    ;

if (!argv.r) {
    throw new Error('[error] No raml address')
}

var config = require('./config/config.js'),
    apiManager = require('./models/apiManager.js'),
    oauthManager = require('./models/oauthManager.js')(config);

var ramlAddress = argv.r,
    ramlString,
    ramlRoot,
    server;

console.log('[core] Start loading raml')
ramlParser.loadFile(ramlAddress).then(function(data){

    ramlRoot = data;
    apiManager.setRamlRoot(data);
    console.log('[core] Raml loading finished');

    oauth.get('/auth', oauthManager.auth);
    oauth.all('/signin', oauthManager.signin);
    oauth.get('/logout', oauthManager.logout);
    oauth.all('/token', oauthManager.token);
    app.all('*', apiManager.ramlMethods);

    server = app.listen(config.port, function () {
        var host = server.address().address
        var port = server.address().port
        console.log('LocalApi listening at http://%s:%s', host, port)
    })

}, function(error){
    console.error(error);
});

