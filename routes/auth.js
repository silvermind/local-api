var fs = require('fs'),
    url = require('url'),
    config = require('./../config');

exports.auth = function(req, res){

    var url_parts = url.parse(req.url, true),
        query = url_parts.query,
        token,
        resPath = '',
        redirectUrl = '';

    query.aid = query.aid || 0;
    query.gid = query.gid || 0;
    query.m = query.m || false;
    query.p = query.p || false;
    query.sdk = query.sdk || 'js';

    if (query.aid == 0 && query.gid == 0) {
        token = config.tokens.member;
    } else {
        token = config.tokens.apps[query.aid]
    }

    if (query.sdk == 'js' || query.sdk == 'ios' || query.sdk == 'android') {
        resPath += '?xdm_e=' + query.xdm_e;
        resPath += '&xdm_c=' + query.xdm_c;
        resPath += '&xdm_p=' + query.xdm_p;
        resPath += '#access_token=' + token + '&token_type=Bearer&expires_in=3600';

        redirectUrl = config.arbiterUrl + resPath;
    } else {
        resPath += '?access_token=' + token;
        resPath += '&token_type=Bearer&expires_in=3600&signed=no';

        redirectUrl = config.apiParams.redirectTo + resPath;
    }

    res.redirect(303, redirectUrl);

};

