var fs = require('fs'),
    faker = require('faker');

function prepareUrl(url) {
    var newBase = url.split('/');
    newBase.pop();
    newBase = newBase.join('/');
    return newBase + '/templates'
}

function readTemplates() {

    var url = prepareUrl(lapi.argv.r);

    fs.readdir(url, function (err, files) {
        if (err) {
            throw new Error(err);
        }
        console.log(files);
        console.log(require('../' + url + '/' + files[0]));
    })
}

readTemplates();

module.exports = {

}