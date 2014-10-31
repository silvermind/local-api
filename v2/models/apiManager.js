var ramlRoot,
    _ = require('lodash');

var getResponse = function (ramlRoot, path, method){
    var resArr,
        currentResource,
        resultMethod,
        resultResponse;

    resArr = path.split('/')
        .map(function(x){
            if(_.isNumber(x)){
                return '_ID_';
            } else {
                return x;
            }
        });

    resArr.splice(0,1);

    currentResource = ramlRoot;

    for (var i = 0, l=resArr.length; i < l; i++){
        var elementName = resArr[i];
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
};

module.exports = {

    setRamlRoot: function (raml) {
        ramlRoot = raml;
    },

    ramlMethods: function(req,res){

        var self = this,
            url = req.url,
            query = req.query,
            method = req.method.toLowerCase();

        try{
            var responseData = getResponse(ramlRoot, req.path, method);
            res.status(200).send(responseData);
        } catch(e){
            console.log(e);
            res.status(404).send({
                "message": "This resource does not exist, look into the documentation",
                "code": 40402
            });
        }

    }



};