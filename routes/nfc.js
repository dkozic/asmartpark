var NfcClient = require('../bindings/nfc/nfcclient');

var IP = "172.25.0.19";
var PORT = 4001;

var nfcClient = new NfcClient(IP, PORT);

exports.view = function(req, res, next) {

	res.render('nfc', {
		title : 'NFC'
	});
};

exports.getDateTime = function(req, res, next) {

	nfcClient.getDateTime(function(data) {
		if (data instanceof Error) {
			return next(data);
		}
		res.render('nfc', {
			title : 'NFC',
			getDateTime : data
		});
	});

};

exports.startRFWork = function(req, res, next) {

	nfcClient.startRFWork(function(data) {
		if (data instanceof Error) {
			return next(data);
		}
		res.render('nfc', {
			title : 'NFC',
			startRFWork : data
		});
	});

};

exports.stopRFWork = function(req, res, next) {

	nfcClient.stopRFWork(function(data) {
		if (data instanceof Error) {
			return next(data);
		}
		res.render('nfc', {
			title : 'NFC',
			stopRFWork : data
		});
	});

};

exports.resetReader = function(req, res, next) {

	nfcClient.resetReader(function(data) {
		if (data instanceof Error) {
			return next(data);
		}
		res.render('nfc', {
			title : 'NFC',
			resetReader : data
		});
	});

};

exports.getFirmwareVersion = function(req, res, next) {

	nfcClient.getFirmwareVersion(function(data) {
		if (data instanceof Error) {
			return next(data);
		}
		res.render('nfc', {
			title : 'NFC',
			getFirmwareVersion : data
		});
	});

};

exports.getTrigState = function(req, res, next) {

	nfcClient.getTrigState(function(data) {
		if (data instanceof Error) {
			return next(data);
		}
		res.render('nfc', {
			title : 'NFC',
			getTrigState : data
		});
	});

};

exports.getRelayState = function(req, res, next) {

	nfcClient.getRelayState(function(data) {
		if (data instanceof Error) {
			return next(data);
		}
		res.render('nfc', {
			title : 'NFC',
			getRelayState : data
		});
	});

};

exports.masterAcknowledge = function(req, res, next) {

	nfcClient.masterAcknowledge(function(data) {
		if (data instanceof Error) {
			return next(data);
		}
		res.render('nfc', {
			title : 'NFC',
			masterAcknowledge : "DONE"
		});
	});

};
