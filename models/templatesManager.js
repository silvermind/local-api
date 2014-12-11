var fs = require('fs'),
    fse = require('fs-extra'),
    path = require('path'),
    Q = require('q'),
    findRemoveSync = require('find-remove'),
    tmplUtils = require('../models/tmplUtils');

global.faker = require('faker');
global.tmplUtils = tmplUtils;

function prepareUrl(url) {
    url = url.split(path.sep);
    url.pop();
    url = url.join(path.sep);

    return path.join(url, 'templates');
}

function genJson(url) {
    
    var urlParts = url.split(path.sep),
        tmplFilename = path.basename(url, '.js'),
        fileContent;

    urlParts.pop();

    fileContent = require(url);
    fileContent = JSON.stringify(fileContent, null, 4);

    urlParts.pop();
    urlParts.push('examples');
    var dirPath = urlParts.join(path.sep) + path.sep;

    console.log('[localapi] Reading template: '.yellow + tmplFilename + '.js');

    fs.writeFileSync(dirPath + tmplFilename + '.json', fileContent, {flags: 'w'});

    console.log('[localapi] Data saved: '.yellow + tmplFilename + '.json');
}

function readTemplates() {

    var deferred = Q.defer(),
        pathTemplates = path.join(lapi.ramlRootDir, 'templates'),
        pathExmaples = path.join(lapi.ramlRootDir, 'examples');

    // create 'examples' dir if doesn't exist
    fse.mkdirsSync(pathExmaples);

    console.log('[localapi] Clean examples directory'.cyan);

    findRemoveSync(pathExmaples, {extensions: ['.json']});

    console.log('[localapi] Reading data templates'.cyan);

    fs.readdir(pathTemplates, function (err, files) {
        if (err) {throw new Error(err);}

        var i = files.length,
            patt = /(\.js)$/i,
            tmplPath;

        while (i--) {
            if (patt.test(files[i])) {

                tmplPath = path.join(pathTemplates, files[i]);
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