var config = require('./../config'),
    raml = require('raml-parser'),
    url = require('url'),
    _ = require('lodash'),
    ramlApi;

raml.loadFile('raml/v1.raml').then( function(data) {
    ramlApi = data;
}, function(error) {
    console.log('Error parsing: ' + error);
});

var getJsonData = function (obj) {
    var res = obj;
    try {
        res = JSON.parse(obj.body['application/json'].example);
    } catch (e) {
        console.log(e);
    }
    return res;
}

exports.responses = function(req, res){

    var reqUrl = req.url,
        url_parts = url.parse(req.url, true),
        query = url_parts.query,
        resArr = url_parts.pathname.split('/'),
        method = req.originalMethod.toLowerCase(),
        currentResource = ramlApi;

    // remove all numbers and 'v1' prefix
    resArr = resArr.map(function (n) {
        if (!(!isNaN(parseFloat(n)) && isFinite(n)) && n != 'v1') {
            return n;
        } else {
            return '_ID_';
        }
    })

    resArr.splice(0,1);
    console.log(url_parts);

    for (var i=0, l=resArr.length; i < l; i++) {
        var elementName = resArr[i];

        var nextElement = _.find(currentResource.resources, function (resource) {
            if (elementName === '_ID_') {
                return !!resource.relativeUri.match(/{(.*?)}/);
            } else {
                return resource.relativeUri === '/' + elementName;
            }
        });

        if (nextElement) {
            currentResource = nextElement;
        }
    }

    var methodObject = _.find(currentResource.methods, {method: method});

    console.log(method + ' ' + reqUrl + ' | ' + methodObject.description);

    var responses = methodObject.responses,
        responseStatus = query.debug || 200;

    setTimeout(function () {
    res.json(getJsonData(responses[responseStatus]));
    }, 700)

};

