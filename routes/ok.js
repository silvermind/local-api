
/*
 * GET users listing.
 */

exports.list = function(req, res){
    res.send({
        status: 'ok',
        data: ['jeden', 'dwa', 'trzy']
    });
};
exports.str = function(req, res){
    console.log(req);
    res.send('test string');
};
