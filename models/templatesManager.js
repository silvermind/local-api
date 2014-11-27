var fs = require('fs'),
    path = require('path'),
    Q = require('q');
global.faker = require('faker');

function prepareUrl(url) {
    return path.dirname(url) + '/templates'
}

function genJson(url) {
    var urlParts = url.split('/'),
        tmplFilename = urlParts.pop().replace(/\.js/, ''),
        jsonPath, fileContent;

    fileContent = require(url);
    fileContent = JSON.stringify(fileContent);

    urlParts.pop();
    urlParts.push('examples');
    var dirPath = urlParts.join('/') + '/';

    console.log('[log] Reading template: '.yellow + tmplFilename + '.js');

    fs.writeFileSync(dirPath + tmplFilename + '.json', fileContent, {flags: 'w'});

    console.log('[log] Data saved: '.yellow + tmplFilename + '.json');
}

function readTemplates() {

    console.log('[log] Reading data templates'.yellow)

    var deferred = Q.defer(),
        url = prepareUrl(lapi.argv.r);

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

        deferred.resolve();

    })

    return deferred.promise;
}

module.exports = {
    run: readTemplates
};