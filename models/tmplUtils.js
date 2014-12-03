module.exports = {

    stringId: function (l) {
        var len = l || 24;
        return (Math.random() + 1).toString(36).substr(2, len);
    },

    randomNumber: function (min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    },

    multiCollection: function (min, max) {
        var _arr = [],
            loops = this.randomNumber(min, max);
        return function (fun) {
            for (var i = 0; i < loops; i++) {
                _arr.push(fun(i));
            }
            return _arr;
        }
    },

    getTemplate: function(url) {
        url = lapi.ramlRootDir + '/templates/' + url;
        delete require.cache[require.resolve(url)];
        return require(url);
    }

}