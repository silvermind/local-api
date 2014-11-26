var fs = require('fs'),
    path = require('path');
global.faker = require('faker');

function prepareUrl(url) {
    return path.dirname(url) + '/templates'
}

function genJson(url) {
    var urlParts = url.split('/'),
        tmplFilename = urlParts.pop().replace(/\.js/, ''),
        dirPath = urlParts.join('/') + '/',
        jsonPath, fileContent;

    fileContent = require(url);
    fileContent = JSON.stringify(fileContent);

    console.log('[log] Reading template: '.yellow + tmplFilename + '.js');

    fs.writeFile(dirPath + tmplFilename + '.json', fileContent, {flags: 'w'}, function (err) {
        if (err) {throw new Error(err);}
        console.log('[log] Data saved: '.yellow + tmplFilename + '.json');
    })
}

function readTemplates() {

    console.log('[log] Reading data templates'.yellow)

    var url = prepareUrl(lapi.argv.r);

    fs.readdir(url, function (err, files) {
        if (err) {throw new Error(err);}

        var i = files.length,
            patt = /(\.js)$/i,
            tmplPath;

        while (i--) {
            if (patt.test(files[i])) {

                tmplPath = appRoot + '/' + url + '/' + files[i];
                genJson(tmplPath);

            }
        }

    })
}

readTemplates();

module.exports = {

}