exports.app = function(config,data){

    var express = require('express'),
        bower = require('bower'),
        path = require('path'),
        fs = require('fs'),
        ramlParser = require('raml-parser'),
        _ = require('lodash'),

        ramlRoot;

    bower.config.cwd = __dirname;
    bower.commands.install(null, null,{})
//        .on('log', function(data){
//            console.log(data);
//        })
//        .on('error', function(data){
//            console.log('an error occurred', data);
//        })
        .on('end', function(data){
            console.log('Installed bower dependencies for Fake API.');
            var ramlString = fs.readFileSync(__dirname + '/bower_components/raml/dist/v1.raml').toString();
            ramlParser.load(ramlString).then(function(data){
                ramlRoot = data;
            }, function(error){
                console.error(error);
            });
        });

    //strip-the-'/v1'-prefix middleware
    function v1proxy(req,res,next){
        if(req.path.match(/^\/v1\//)){
            req.url = req.url.replace(/^\/v1\//,'/');
            next();
        } else {
            res.send(404,'Error 404: resource cannot be found');
        }
    }

    var api = express();

    //FIXME: currently the routing for easyxdm doesn't work - there is a '../easyXDM.debug.js' in index.html
    // this requires a change in the index.html source of easyXDM or a change in routing
    api.get('/easyxdm/', function(req,res){
        res.sendfile(__dirname + '/bower_components/easyXDM-custom/dist/cors/index.html');
    });

//    api.use('/easyxdm/', express.static(__dirname + '/bower_components/easyXDM-custom'));

    api.use(v1proxy);

    function isNumber(n){
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    //get a response based on the 'example' field in a RAML resource definition
    function getResponse(path, method){

        var resArr,
            currentResource,
            resultMethod,
            resultResponse;

        resArr = path.split('/')
            .map(function(x){
                if(isNumber(x)){
                    return '_ID_';
                } else {
                    return x;
                }
            });

        resArr.splice(0,1);

        currentResource = ramlRoot;

        for (var i = 0, l=resArr.length; i < l; i++){
            var elementName = resArr[i];
            console.log('Element name: ',elementName);
            var nextElement = _.find(currentResource.resources, function(resource){
                if(elementName === '_ID_'){
                    return resource.relativeUri.match(/{(.*?)}/);
                } else {
                    return resource.relativeUri === '/'+elementName;
                }
            });

            if(nextElement) {
                currentResource = nextElement;
            } else {
                throw new Error('Specified path not in raml');
            }
        }

        resultMethod = _.find(currentResource.methods, {method: method});
        if(resultMethod){
            var rr = resultMethod.responses;
            //choose which success response is present
            var resCode = ("200" in rr && "200") || ("201" in rr && "201") || ("202" in rr && "202");
            if(resCode){
//                console.log(resultMethod.responses[resCode].body['application/json'].example);

                resultResponse = resultMethod.responses[resCode].body['application/json'].example;
            } else {
                throw new Error('No success response body in raml');
            }
        } else {
            throw new Error('Specified method not in raml');
        }

        return resultResponse;
    }

    api.all('*',function(req,res){

        var url = req.url,
            query = req.query,
            method = req.method.toLowerCase();

        try{
            var responseData = getResponse(req.path,method);
            res.send(200,responseData);
        } catch(e){
            console.log(e);
            res.send(404,{
                "message": "This resource does not exist, look into the documentation",
                "code": 40402
            });
        }

    });

    return api;

};