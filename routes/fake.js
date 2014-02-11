var fs = require('fs');

exports.login = function(req, res){
    res.redirect('http://10.132.31.197:3000/#access_token=1&token_type=Bearer&expires_in=999400')
};

exports.findAnswer = function(req, res){

    var reqUrl = req.url,
        resArr = reqUrl.split('/'),
        method = req.originalMethod.toLowerCase();

    if (method === 'put' || method === 'delete') {
        res.json('');
    }

    resArr.splice(0,1);

    // remove all numbers and 'v1' prefix
    resArr = resArr.filter(function (n) {
        return !(!isNaN(parseFloat(n)) && isFinite(n)) && n != 'v1';
    })

    var jsonFileName = resArr.join('_') + '_' + method + '.json';

    console.log(jsonFileName);

    function readJsonFileSync(filepath, encoding){

        if (typeof (encoding) == 'undefined'){
            encoding = 'utf8';
        }
        var file = fs.readFileSync(filepath, encoding);
        return (file) ? JSON.parse(file) : '';
    }

    function getFile(file){

        var filepath = __dirname + '/../json/' + file;
        return readJsonFileSync(filepath);
    }

    res.json(getFile(jsonFileName));
};

