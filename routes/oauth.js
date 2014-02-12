
/*
 * Fake OAUTH responder
 */


exports.token = function(req, res){
    console.log("Getting token \n" + req);
    var response = {
        token_type: "Bearer",
        expires_in: "3600",
        access_token: "965c8d4d29717ad3ad8e82447c55b1e"
    };

    res.header("Content-Type", "application/json");
    res.send(response);
};
