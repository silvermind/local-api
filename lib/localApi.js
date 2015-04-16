var express = require('express'),
  pack = require('../package'),
  path = require('path'),
  bodyParser = require("body-parser"),
  app = express(),
  _ = require('lodash'),
  ramlParser = require('raml-parser'),
  winston = require('winston'),
  colors = require('colors')
  ;

var currentPort = null;

app.use(bodyParser.json());

var config = require('./../config/config.js'),
  customUtils = require('./../models/utils.js'),
  apiManager = require('./../models/apiManager.js'),
  templatesManager = require('./../models/templatesManager.js');

// set global data
global.lapi = {
  appRoot: path.resolve(__dirname), // app root dir path
  ramlAddress: null // raml url
};



var ramlRoot,
  server;

exports.start = function (ramlUrl, port) {

  global.lapi.ramlAddress = ramlUrl;
  currentPort = port || 3333;

  // set raml root dir path
  global.lapi.ramlRootDir = customUtils.getRamlRootDir(ramlUrl);

  winston.info('LocalAPI'.cyan, pack.version, 'by IsaaCloud.com');
  winston.info('[localapi]', 'Run app'.green);

  templatesManager.run().then(function () {

    winston.debug('[localapi]', 'Start'.yellow, 'raml loading');
    return ramlParser.loadFile(lapi.ramlAddress);


  }).then(function(data){

    ramlRoot = data;
    apiManager.setRamlRoot(data);
    winston.debug('[localapi]', 'Success'.green, 'raml loading');

    app.use(customUtils.restLogger)

    //app.get('/oauth/auth', oauthManager.auth);
    //app.all('/oauth/token', oauthManager.token);
    app.all('*', apiManager.ramlMethods);

    server = app.listen(currentPort, function () {
      var host = server.address().address
      var port = server.address().port

      winston.debug('[localapi]', 'Finished'.green);
      winston.info('[localapi]', 'App running at', colors.gray('http:/'+host+':'+port))
    })

  }, function(error){
    winston.error(error);
  });
}


