var fs = require('fs');

exports.token = function(req, res){
    console.log('token regenerate');
    req.method = 'get';
    res.redirect('http://10.132.31.197:3000/#test=111');
};

exports.admin = function(req, res){

    var reqUrl = req.url,
        resArr = reqUrl.split('/'),
        method = req.originalMethod.toLowerCase();

    if (method === 'put' || method === 'delete') {
        res.json('');
    }

    resArr.splice(0,1);

    // remove all numbers and 'v1' prefix
    resArr = resArr.filter(function (n) {
        return !(!isNaN(parseFloat(n)) && isFinite(n)) && n != 'v1' && n != 'admin';
    })

    var methodName = getMethodName(method);

    var jsonFileName = resArr.join('_') + '_' + methodName + '_example.json';

    console.log(jsonFileName);

    res.json(getFile(jsonFileName));
};

function readJsonFileSync(filepath, encoding){
    if (typeof (encoding) == 'undefined'){
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return (file) ? JSON.parse(file) : '';
}

function getFile(file){
    var filepath = __dirname + '/../json/admin/' + file;
    return readJsonFileSync(filepath);
}

function getMethodName(method) {
    var name;
    switch (method) {
        case 'get':
            name = 'list';
            break;
        default:
            name = method;
            break;
    }
    return name;
}
