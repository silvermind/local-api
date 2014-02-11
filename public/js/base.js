function listener(e){
    if (e.origin === 'http://localhost:3000') {
        if (IsJsonString(e.data)) {
            var reqData = JSON.parse(e.data);
            console.log('req json', reqData);
            $.ajax({
                type: reqData.method,
                url: reqData.url,
                headers: reqData.headers,
                success: function(res) {

                }
            })
        }
    }
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

if (window.addEventListener){
    addEventListener("message", listener, false)
} else {
    attachEvent("onmessage", listener)
}
