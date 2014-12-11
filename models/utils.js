var path = require('path'),
    fs =  require('fs');

module.exports = {

    restLogger: function (req, res, next) {
        console.log('##########################'.red);
        console.info('[REST] Request'.green);
        console.log('Date:'.green, new Date());
        console.log('Method:'.green, req.method);
        console.log('Url:'.green, req.url);
        console.log('Headers: \n'.green, req.headers);
        console.log('Body: \n'.green, req.body);
        next();
    },

    getRamlRootDir: function (url) {
        url = fs.realpathSync(url);
        var _res = url.split(path.sep);
        _res.pop();
        return _res.join(path.sep);
    }

}