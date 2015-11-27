//modules
var express = require('express');
var http = require('http');
var path = require('path');
var i18n = require('i18next');
var config = require('config');
var log = require('./lib/log')('/app');
var flash = require('express-flash');
var moment = require('moment');
var expressValidator = require('express-validator');

//routes configuration
var routes = require('./routes');
var dashboard = require('./routes/dashboard');
var history = require('./routes/history');
var about = require('./routes/about');
var nfc = require('./routes/nfc');

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
app.use(expressValidator());
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
app.get('/nfc', nfc.view);
app.get('/nfc/getDateTime', nfc.getDateTime);
app.get('/nfc/setDateTime', nfc.setDateTime);
app.get('/nfc/startRFWork', nfc.startRFWork);
app.get('/nfc/stopRFWork', nfc.stopRFWork);
app.get('/nfc/resetReader', nfc.resetReader);
app.get('/nfc/getFirmwareVersion', nfc.getFirmwareVersion);
app.get('/nfc/getTrigState', nfc.getTrigState);
app.get('/nfc/getRelayState', nfc.getRelayState);
app.get('/nfc/setRelayState', nfc.setRelayState);
app.get('/nfc/masterAcknowledge', nfc.masterAcknowledge);
app.get('/nfc/getParameterRSSI', nfc.getParameterRSSI);
app.get('/nfc/setParameterRSSI', nfc.setParameterRSSI);
app.get('/nfc/getIdBuffer', nfc.getIdBuffer);

setup.init(app, io);

httpServer.listen(app.get('port'), function() {
	log.info('Express server listening on port ' + app.get('port'));
});
