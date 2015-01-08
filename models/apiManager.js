var _ = require('lodash'),
    amanda = require('amanda'),
    Q =  require('q'),
    ramlRoot,
    methodToValidate = ['post', 'put'];

var getResponse = function (ramlRoot, req){

    var deffered = Q.defer();

    var contentType, preparedPath, currentResource, currentMethod, successResponse;

    contentType = localUtils.getContentType(req);

    req.method = req.method.toLowerCase();

    // prepare req path for searching
    preparedPath = localUtils.pathPrepare(req.path);

    // find current resource in raml definitions
    currentResource = localUtils.findResource(ramlRoot, preparedPath);

    // find chosen method in raml definitions
    currentMethod = localUtils.findMethod(currentResource, req.method);

    // find success response in this resource
    successResponse = localUtils.findSuccessResponse(currentMethod.responses, contentType, req.method);

    // check if sent data is valid (POST, PUT)
    if (methodToValidate.indexOf(req.method) >= 0 && successResponse.schema) {

        localUtils.validateJson(req.body, successResponse.schema, function (err) {
            var _finalRes;
            if (err) {
                _finalRes = {
                    data: {
                        message: err['0'].message
                    },
                    code: 400
                }
            } else {
                var resBody = _.defaults(req.body, successResponse.example)
                _finalRes = {
                    data: resBody,
                    code: 200
                }
            }
            deffered.resolve(_finalRes);
        });

    } else {
        // send response
        deffered.resolve({
            data: successResponse.example,
            code: 200
        });
    }

    return deffered.promise;

};

var localUtils = {

    pathPrepare: function(path) {
        var p = path.split('/');
        p.splice(0,1);

        if (_.last(p) === '') {
            p.pop();
        }

        return p;
    },

    getContentType: function (req) {
        return req.header('Content-Type');
    },

    findResource: function (ramlRoot, preparedPath) {
        var currentResource = ramlRoot,
            elementName, nextElement, relativeUri;

        for (var i = 0, l=preparedPath.length; i < l; i++){

            elementName = preparedPath[i];
            nextElement = _.find(currentResource.resources, function(resource){
                relativeUri = resource.relativeUri.substring(1);
                return relativeUri === elementName;
            });

            if (!nextElement) {
                nextElement = _.find(currentResource.resources, function(resource){
                    relativeUri = resource.relativeUri.substring(1);
                    return relativeUri.match(/{(.*?)}/);
                });
            }

            if(nextElement) {
                currentResource = nextElement;
            } else {
                throw new Error('Specified path not in raml');
            }

        }

        return currentResource;
    },

    findMethod: function (resource, method) {
        var res = _.find(resource.methods, {method: method});
        if (res) {
            return res;
        } else {
            throw new Error('Specified method not in raml');
        }
    },

    findSuccessResponse: function (responses, contentType, method) {
        var code = responses['200'] || responses['201'] || responses ['202'];
        if (!code) {throw new Error('Success response is not specified fot this resource');}

        var body = code.body;
        if (!body) {throw new Error('Body is not specified fot this resource');}

        var succ;
        if (contentType) {
            contentType = contentType.split(';')[0];
            succ = body[contentType];
            if (!succ) {throw new Error('Content-Type ' + contentType + ' is not specified fot this resource');}
        } else {
            succ = body['application/json'];
            if (!succ) {throw new Error('No data for undefined Content-Type');}
        }

        return succ;
    },

    validateJson: function (body, schema, succ) {
        var jsonSchemaValidator = amanda('json');
        schema = JSON.parse(schema);
        jsonSchemaValidator.validate(body, schema, succ);
    }

}

module.exports = {

    setRamlRoot: function (raml) {
        ramlRoot = raml;
    },

    ramlMethods: function(req,res){

        var self = this;

        try{
            getResponse(ramlRoot, req).then(function (ramlRes) {
                res.status(ramlRes.code).send(ramlRes.data);
            });
        } catch(e){
            console.log(e);
            res.status(404).send({
                "message": "This resource does not exist, look into the documentation",
                "code": 40402
            });
        }

    }



};