//modules
var express = require('express');
var http = require('http');
var path = require('path');
var i18n = require('i18next');
var config = require('config');
var log = require('./lib/log')('/app');
var flash = require('express-flash');
var moment = require('moment');

//routes configuration
var routes = require('./routes');
var dashboard = require('./routes/dashboard');
var history = require('./routes/history');
var about = require('./routes/about');

var setup = require('./setup');


var app = express();
var httpServer = http.createServer(app);
var io = require('socket.io')(httpServer);

i18n.init({
	saveMissing : false,
	debug : true,
	lng : config.get('i18n.lng'),
	fallbackLng : config.get('i18n.fallbackLng')
});

// all environments
app.set('port', process.env.PORT || config.get('server.port'));
app.use(i18n.handle);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(express.cookieParser('keyboard cat'));
app.use(express.bodyParser());
app.use(express.session({
	cookie : {
		maxAge : config.get('server.sessionTimeout')
	}
}));
app.use(flash());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes.notfound);
app.use(routes.error);

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
	app.locals.pretty = true;
}

i18n.registerAppHelper(app);

app.locals.moment = moment;

//routes configuration
app.get('/', routes.index);
app.get('/about', about.view);
app.get('/dashboard', dashboard.view);
app.get('/history/:id', history.list);

setup.init(app, io);

httpServer.listen(app.get('port'), function() {
	log.info('Express server listening on port ' + app.get('port'));
});
