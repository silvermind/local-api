//var express = require('express')
//    , routes = require('./routes')
//    , config = require('./config')
//    , user = require('./routes/user')
//    , ok = require('./routes/ok')
//    , fake = require('./routes/fake')
//    , auth = require('./routes/auth')
//    , oauth = require('./routes/oauth')
//    , fakeJson = require('./routes/fakeJson')
//    , fakeErrors = require('./routes/fakeErrors')
//    , api = require('./routes/api')
//    , http = require('http')
//    , path = require('path');
var https = require('https'),
    fs = require('fs'),

    express = require('express'),
    vhost = require('vhost'),

    _ = require('lodash')
    ;

//config represents the configurations of all servers - urls, default settings etc
var config = require('./config.js');
//data represents the IsaaCloud and OAuth data that is processed or sent to the users or shared between the servers
var data = require('./data.js');

//initialize hosts file utility
//if(typeof config.hostsUtil == 'object' && config.hostsUtil.use) {
//    var hostDict = {};
//    config.fakeServers.forEach(function (f) {
//        hostDict[f.hostname] = f.fakeIP;
//    });
//    var hostsUtil = require('./hostsUtil.js')(config.hostsUtil.path, hostDict, config.hostsUtil.newline);
//
//    //handle cleanup of hosts file at end of execution
//    function exitHandler(options,err){
//        if(err) {
//            console.log(err.stack);
//        }
//        if(options.cleanup){
//            hostsUtil.revert();
//        }
//        if(options.exit) {
//            process.exit();
//        }
//    }
//
//    process
//        //fire handler when app is closing
//        .on('exit', exitHandler.bind(null,{cleanup:true}))
//        //fire handler on ctrl+c event
//        .on('SIGINT', exitHandler.bind(null, {exit: true}))
//        //fire handler on kill -9
//        .on('SIGTERM', exitHandler.bind(null, {exit: true}))
//        //fire handler on uncaught exceptions
//        .on('uncaughtException', exitHandler.bind(null, {exit:true}));
//
//    hostsUtil.init();
//}

//create main Express server
var fake = express();

config.fakeServers.forEach(function(server){
    var appConfig = server.config;

    //load the app from file and initialize it with the supplied config and data
    var app = require(server.appDir).app(appConfig,data);

    fake.use(vhost(server.hostname, app));
    console.log('faking server '+server.hostname);
});

//the certificate should be a wildcard certificate for all the domains that are to be faked, e.g. *.isaacloud.com
var options = {
    key: fs.readFileSync(__dirname+'/server.key'),
    cert: fs.readFileSync(__dirname+'/server.crt')
};
https.createServer(options,fake).listen(config.port);

console.log('Fake IsaaCloud server listening on port '+config.port+'...\n');