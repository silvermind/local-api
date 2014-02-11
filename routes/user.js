
/*
 * GET users listing.
 */

exports.list = function(req, res){
    res.send([
        {
            id: 5,
            name: 'test',
            surname: 'testowy'
        }
    ]);
};
