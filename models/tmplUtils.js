module.exports = {

    randomNumber: function (min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    },

    multiCollection: function (min, max) {
        var _arr = [],
            loops = this.randomNumber(min, max);
        return function (fun) {
            for (var i = 0; i < loops; i++) {
                _arr.push(fun());
            }
            return _arr;
        }
    }

}