
/*
 * Fake OAUTH responder
 */


exports.token = function(req, res){
    console.log("Getting token \n" + req);
    
    var body = req.body;
    var headers = req.headers;
    
    if( typeof(headers.authorization) == 'undefined') {
    	var response = {
    		error: "Missing http header: Authorization",
    	};
    	res.status(401);
    } else if( headers.authorization != 'Basic Mzc4OTE2NzgzNDpzODNqamRzOWsza2M5c2FrdW5qa3hkZg' ) {
    	var response = {
    		error: "Authorization token is invalid",
    	};
    	res.status(401);
    } else if( typeof body.grant_type == 'undefined') {
    	var response = {
    		error: "Required parameter is missing: grant_type",
    	};
    	res.status(400);
    } else if( body.grant_type != 'client_credentials') {
    	var response = {
    		error: "Required parameter is invalid: grant_type",
    	};
    	res.status(400);
    } else {
	    var response = {
	        token_type: "Bearer",
	        expires_in: "10",
	        access_token: "965c8d4d29717ad3ad8e82447c55b1e"
	    };
	}

    res.header("Content-Type", "application/json");
    res.send(response);
};
