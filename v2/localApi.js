var https = require('https'),
    fs = require('fs'),
    express = require('express'),
    app = express(),
    _ = require('lodash'),
    ramlParser = require('raml-parser'),
    argv = require('minimist')(process.argv.slice(2))
    ;

if (!argv.r) {
    throw new Error('[error] No raml address')
}

var config = require('./config/config.js'),
    apiManager = require('./models/apiManager.js');

var ramlAddress = argv.r,
    ramlString,
    ramlRoot,
    server;

console.log('[core] Start loading raml')
ramlParser.loadFile(ramlAddress).then(function(data){

    ramlRoot = data;
    console.log('[core] Raml loading finished');

    app.all('*',function(req,res){

        var url = req.url,
            query = req.query,
            method = req.method.toLowerCase();

        try{
            var responseData = apiManager.getResponse(ramlRoot, req.path, method);
            res.status(200).send(responseData);
        } catch(e){
            console.log(e);
            res.status(404).send({
                "message": "This resource does not exist, look into the documentation",
                "code": 40402
            });
        }

    });

    server = app.listen(config.port, function () {
        var host = server.address().address
        var port = server.address().port
        console.log('LocalApi listening at http://%s:%s', host, port)
    })

}, function(error){
    console.error(error);
});

