var _res;

_res = tmplUtils.multiCollection(3, 40)(function (i) {
    return tmplUtils.getTemplate('user.js');
});

module.exports = _res;