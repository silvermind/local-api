var _ = require('lodash');

module.exports = function(config){

    function getRedirectUrl(req){

        //var query = req.query,
        //    token,
        //    resPath = '',
        //    redirectUrl = config.arbiterUrl;
        //
        //_.defaults(query, {
        //    aid: 0,
        //    gid: 0,
        //    m: false,
        //    p: false,
        //    sdk: 'js'
        //});
        //
        //token = (query.aid == 0 && query.gid == 0) ? config.memberToken : config.appToken;
        //
        //if (query.sdk == 'js' || query.sdk == 'ios' || query.sdk == 'android') {
        //    resPath += '?xdm_c=' + query.xdm_c;
        //    resPath += '&xdm_p=' + query.xdm_p;
        //    resPath += '&xdm_e=' + query.xdm_e;
        //    resPath += '&gid=' + query.gid;
        //    resPath += '&aid=' + query.aid;
        //    resPath += '&sdk=' + query.sdk;
        //    resPath += '&origin=' + query.origin;
        //    resPath += '&p=false';
        //    resPath += '#access_token=' + token;
        //    resPath += '&token_type=Bearer&expires_in=3600';
        //
        //    redirectUrl = config.arbiterUrl + resPath;
        //} else {
        //    resPath += 'https://isaacloud.com';
        //}
        //
        //return redirectUrl;

        var _res;

        if (req.query.origin) {

            _res = req.query.origin + req.url;
            _res += '#access_token=' + config.appToken + '&token_type=Bearer&expires_in=3600';

        } else {

            console.log('[error] No origin parameter specified.'.red)
            _res = 'https://isaacloud.com'

        }

        return _res;

    }

    return {
        auth: function (req, res) {
            res.redirect(303, getRedirectUrl(req));
        },

        signin: function (req, res) {
            res.redirect(303,getRedirectUrl(req));
        },

        logout: function (req, res) {
            res.redirect(303,'http://isaacloud.com');
        },

        token: function (req, res) {
            if(req.method === 'POST'){

                res.header('Content-Type','application/json');

                var body = req.body,
                    headers = req.headers,
                    status,
                    response;

                if (!headers.authorization) {
                    response = {error: "Missing http header: Authorization"};
                    status = 401;
                } else if (headers.authorization.indexOf('Basic ') != 0) {
                    response = {error: "Authorization token is invalid"};
                    status = 401;
                } else if (!body.grant_type) {
                    response = {error: "Required parameter is missing: grant_type"};
                    status = 401;
                } else if (body.grant_type !== 'client_credentials') {
                    response = {error: "Required parameter is invalid: grant_type"};
                    status = 401;
                } else {
                    response = {
                        token_type: "Bearer",
                        expires_in: "3600",
                        access_token: config.appToken
                    };
                    status = 200;
                }

                res.status(status).send(response);

            } else {
                res.redirect(303,'http://isaacloud.com');
            }


        }

    };


};
