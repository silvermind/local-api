(function(){

    var hash = window.location.hash.substring(1);
    var parent = null;
    if(window.opener){
        parent = window.opener;
    } else if(window.parent){
        parent = window.parent;
    }

    //check if current window is an child iframe/popup
    var isChild = (window.name == 'IsaaCloudAuth' && parent );

    //check if the parent waits for a response, catch the error if parent is not same origin
    try{
        isChild = isChild && parent._receiveResponse;
    } catch(e){
        isChild = false;
    }

    if(isChild){

//CHILD PART: if a child popup or iframe gets redirected to this address with the token/error in its hash, it calls its parent

        (function() {

            function getVariable(string, variable) {
                var vars = string.split('&');
                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split('=');
                    if (decodeURIComponent(pair[0]) == variable) {
                        var val = decodeURIComponent(pair[1]);
                        if(val !== "null"){
                            return val;
                        } else {
                            return undefined;
                        }
                    }
                }
                return undefined;
            }


            var token = getVariable(hash, 'access_token'),
                error = getVariable(hash, 'error');

            if (error) {
                parent._receiveResponse({error: error});
            } else if (token) {
                var res = {
                    access_token: token,
                    token_type: getVariable(hash, 'token_type'),
                    expires_in: getVariable(hash, 'expires_in')
                };
                var mid = getVariable(hash, 'mid'),
                    uid = getVariable(hash, 'uid');
                if (mid) {
                    res.mid = mid;
                }
                if (uid) {
                    res.uid = uid;
                }
                parent._receiveResponse(res);
            }

        })();

//END OF CHILD PART

    } else {

//PARENT PART: the parent window offers methods for connection through EasyXDM Rpc

        (function () {

            //create a hidden iframe for making a connection to OAuth
            function makeIframe(src){
                var iframe = document.createElement('iframe');
                iframe.src = src;
                iframe.name = 'IsaaCloudAuth';
                iframe.width = 0;
                iframe.height = 0;
                iframe.tabIndex = -1;
                iframe.title = 'empty';
                iframe.width = 0;
                iframe.style.display = 'none';
                return iframe;
            }

            //validate the response from the window's child and call success/error accordingly
            function processChildResponse(res,success,error){
                if(res){
                    if(res.access_token && res.token_type && res.expires_in){
                        success(res);
                    } else if(res.error){
                        error({
                            error:res.error
                        });
                    }
                } else {
                    error({
                        error:'no data received'
                    });
                }
            }

            //generic structure of making a call to OAuth - init and cleanup allow for setting timeouts, creating popup/iframe etc.
            function performAction(config,success,error,init,cleanup){

                if(!config.url){
                    error({
                        error:'invalid target url'
                    });
                }

                window._receiveResponse = function(res){
                    console.log('PARENT: received message from child: '+JSON.stringify(res));
                    cleanup();
                    delete window._receiveResponse;
                    processChildResponse(res,success,error);
                };

                init();
            }

            console.log('PARENT: preparing XDM endpoint');

            // instantiate a new easyXDM object which will handle the requests
            var remote = new easyXDM.Rpc({
                local: "../bower_components/easyXDM-custom/dist/name.html",
                swf: "../bower_components/easyXDM-custom/dist/easyxdm.swf"
            }, {
                local: {

                    //retrieve token
                    auth: function (config, success, error) {

                        config.timeout = config.timeout || 5 * 1000;
                        var child, timeout;
                        performAction(config, success, error, function init() {
                            timeout = setTimeout(function(){
                                error({
                                    error:'connection timed out'
                                });
                            },config.timeout);
                            console.log('PARENT: creating an /auth child iframe');
                            child = makeIframe(config.url);
                            document.body.appendChild(child);
                        }, function cleanup() {
                            clearTimeout(timeout);
                            document.body.removeChild(child);
                        });

                    },

                    //login popup
                    signin: function (config, success, error) {

                        var popup;
                        performAction(config, success, error, function init() {
                            console.log('PARENT: creating a /signin child popup');
                            popup = window.open(config.url, 'IsaaCloudAuth', config.popupOptions);
                            if (window.focus) {
                                popup.focus();
                            }
                        }, function cleanup() {
                            if (popup) {
                                popup.close();
                            }
                        });

                    },

                    //log out
                    logout: function (config, success, error) {

                        //TODO change oauth to redirect to arbiter after logout?
                        //TODO oauth invalidate token & cookie on logout
                        //TODO delete cookie on logout?
                        if(!config.url){
                            error({
                                error:'invalid target url'
                            });
                        }

                        var child = makeIframe(config.url);
                        document.body.appendChild(child);
                        setTimeout(function(){
                            document.body.removeChild(child);
                            success({
                                logout:true
                            });
                        },200);

                    }
                }
            });

        })();

//END OF PARENT PART
    }

})();