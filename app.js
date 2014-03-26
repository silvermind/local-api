
/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , config = require('./config')
    , user = require('./routes/user')
    , ok = require('./routes/ok')
    , fake = require('./routes/fake')
    , auth = require('./routes/auth')
    , oauth = require('./routes/oauth')
    , fakeJson = require('./routes/fakeJson')
    , fakeErrors = require('./routes/fakeErrors')
    , api = require('./routes/api')
    , http = require('http')
    , path = require('path');

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3005);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser({strict: false}));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});


//OAuth fake mechanism
app.all('/oauth', fake.login);
app.all('/oauth/client/:clientId/authorize', fakeJson.token);
app.all('/oauth/token', oauth.token);

app.all('/auth', auth.auth);


//API fake mechanism
app.all('/system/*', fake.findAnswer);
app.all('/errors/*', fakeErrors.check);

app.all('/admin/*', api.responses);


http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
