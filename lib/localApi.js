var express = require('express'),
    path = require('path'),
    bodyParser = require("body-parser"),
    app = express(),
    _ = require('lodash'),
    ramlParser = require('raml-parser'),
    argv = require('minimist')(process.argv.slice(2)),
    colors = require('colors')
    ;

if (!argv.r) {
    throw new Error('[error]'.red +' No raml address')
}

app.use(bodyParser.json());

var config = require('./../config/config.js'),
    customUtils = require('./../models/utils.js'),
    apiManager = require('./../models/apiManager.js'),
    templatesManager = require('./../models/templatesManager.js'),
    oauthManager = require('./../models/oauthManager.js')(config);

// set global data
global.lapi = {
    argv: argv, // run parameters
    appRoot: path.resolve(__dirname), // app root dir path
    ramlAddress: argv.r // raml url
};

// set raml root dir path
global.lapi.ramlRootDir = customUtils.getRamlRootDir(lapi.ramlAddress);

var ramlRoot,
    server;

exports.start = function () {
    console.log('LocalAPI start!'.green);
    console.log('[localapi] Gen templates'.yellow);

    templatesManager.run().then(function () {

        console.log('[localapi] Start loading raml'.yellow);
        return ramlParser.loadFile(lapi.ramlAddress);

    }).then(function(data){

        ramlRoot = data;
        apiManager.setRamlRoot(data);
        console.log('[localapi] Raml loading finished'.green)

        app.use(customUtils.restLogger)

        //app.get('/oauth/auth', oauthManager.auth);
        //app.all('/oauth/token', oauthManager.token);
        app.all('*', apiManager.ramlMethods);

        server = app.listen(config.port, function () {
            var host = server.address().address
            var port = server.address().port
            console.log('[localapi] App listening at http://%s:%s'.green, host, port)
        })

    }, function(error){
        console.error(error);
    });
}


