
/*
 * Fake OAUTH responder
 */


exports.check = function(req, res){
    
    var error = req.url.split('/')[2];
    
    if( error == "timeout" ) {
    	setTimeout(function(){
    		res.send("timeout");
    	}, 10000);
    }
    else {
    	if( parseInt(error) == error ) res.status(error);
		res.send("Error "+error);
	}
};
