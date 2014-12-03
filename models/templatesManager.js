var fs = require('fs'),
    path = require('path'),
    Q = require('q'),
    findRemoveSync = require('find-remove'),
    tmplUtils = require('../models/tmplUtils');

global.faker = require('faker');
global.tmplUtils = tmplUtils;

function prepareUrl(url) {
    url = url.split('/');
    url.pop();
    url = url.join('/');
    return url + '/templates'
}

function genJson(url) {
    var urlParts = url.split('/'),
        tmplFilename = urlParts.pop().replace(/\.js/, ''),
        fileContent;

    fileContent = require(url);
    fileContent = JSON.stringify(fileContent, null, 4);

    urlParts.pop();
    urlParts.push('examples');
    var dirPath = urlParts.join('/') + '/';

    console.log('[log] Reading template: '.yellow + tmplFilename + '.js');

    fs.writeFileSync(dirPath + tmplFilename + '.json', fileContent, {flags: 'w'});

    console.log('[log] Data saved: '.yellow + tmplFilename + '.json');
}

function readTemplates() {

    console.log('[log] Clean examples directory'.yellow)

    findRemoveSync(lapi.ramlRootDir + '/examples', {extensions: ['.json']});

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

                tmplPath = url + '/' + files[i];
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